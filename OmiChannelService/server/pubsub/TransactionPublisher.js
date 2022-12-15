import {redisClient} from "../database/RedisClient";
import {BasePubSub} from "./BasePubSub";
import db from "../models";
import {TRANS_LOG_TYPE, TRANS_PAID_STATUS} from "../helper/appConst";

export const TRANSACTION_CONFIRM = "TRANSACTION_CONFIRM";

class TransactionPublisher extends BasePubSub {
    constructor() {
        if (TransactionPublisher._instance) {
            return TransactionPublisher._instance;
        }
        super("transaction");
        TransactionPublisher._instance = this;
    }

    registerSubscribe() {
        this.subscribe(TRANSACTION_CONFIRM, this.subscribeTransactionConfirm.bind(this));
    }

    publishTransactionConfirm(model) {
        this.publish(TRANSACTION_CONFIRM, model);
    }

    async subscribeTransactionConfirm(data) {
        console.log("Sub:", data);
        //Find parent and user
        const t = await db.sequelize.transaction();
        try {
            const ownerUser = await db.User.findByPk(data.ownerId);
            if (!ownerUser) {
                throw new Error("subscribeTransactionConfirm - Not found owner");
            }

            let parentUser = null;
            if (data.parentOwnerId) {
                parentUser = await db.User.findByPk(data.parentOwnerId);
            }

            //Calculate commission per user
            let {commission, upperCommission = 0, selfDiscount = 0, totalOrder = 0} = data;
            if (!commission || commission < 0) {
                throw new Error("subscribeTransactionConfirm - Commission not founded or below zero");
            }


            let discountInPercent = parseFloat((selfDiscount / totalOrder).toFixed(4));
            console.log("Discount in percent:", discountInPercent);
            let endUserCommission = commission;
            let endParentCommission = upperCommission;

            if (endUserCommission < discountInPercent) {
                console.error("Discount more than user commission:"
                    , discountInPercent
                    , endUserCommission
                    , endParentCommission);
                throw new Error("Fix discount");
            }

            if (parentUser) {
                const rate1 = parseFloat((commission / (commission + upperCommission)).toFixed(2));
                const rate2 = 1 - rate1;
                console.log("Rate:", rate1, rate2);
                const discount1 = parseFloat((discountInPercent * rate1).toFixed(4));
                const discount2 = parseFloat((discountInPercent * rate2).toFixed(4));
                console.log("Discount :", discount1, discount2);
                endUserCommission = commission - (discount1 * 100);
                endParentCommission = upperCommission - (discount2 * 100);
            } else {
                console.log("Single discount");
                endUserCommission = commission - (discountInPercent * 100);
            }

            console.log("End commission", endUserCommission, endParentCommission);
            if (endUserCommission < 0 || endParentCommission < 0) {
                console.error("Commission cannot below zero", endUserCommission, endParentCommission);
                throw new Error("Commission cannot below zero");
            }

            //To transaction log
            const userLog = await db.TransactionLog.build({
                transactionId: data.id,
                transactionOpenId: data.transactionId,
                orderId: data.orderId,
                fromUser: ownerUser.id,
                ownerId: ownerUser.id,
                total: data.total,
                totalCommission: Math.floor(data.total * endUserCommission / 100),
                commission: endUserCommission,
                appointmentId: data.appointmentId,
                type: TRANS_LOG_TYPE.INCOME,
                paidStatus: TRANS_PAID_STATUS.WAITING,
            });

            await userLog.save({transaction: t});

            //To transaction parent log
            if (parentUser) {
                const parentLog = await db.TransactionLog.build({
                    transactionId: data.id,
                    transactionOpenId: data.transactionId,
                    orderId: data.orderId,
                    fromUser: ownerUser.id,
                    ownerId: parentUser.id,
                    total: data.total,
                    totalCommission: Math.floor(data.total * endParentCommission / 100),
                    commission: endParentCommission,
                    appointmentId: data.appointmentId,
                    type: TRANS_LOG_TYPE.INCOME,
                    paidStatus: TRANS_PAID_STATUS.WAITING,
                });

                await parentLog.save({transaction: t});
            }

            await t.commit();
        } catch (e) {
            console.error(e);
            await t.rollback();
        }
    }
}

const instance = new TransactionPublisher();
export default instance;