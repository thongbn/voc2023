import React, {Suspense, useEffect} from "react";

// Motion
import {motion} from 'framer-motion/dist/framer-motion';

// Redux
import {useDispatch, useSelector} from "react-redux";
import {theme} from "../redux/customise/customiseActions";

// Router
import {
    BrowserRouter,
    Route,
    Switch,
    Redirect
} from "react-router-dom";

// Routes
import {Routes} from "./routes";

// Layouts
import VerticalLayout from "../layout/VerticalLayout";
import HorizontalLayout from "../layout/HorizontalLayout";
import FullLayout from "../layout/FullLayout";

// Components
import Home from "../view/home";
import Error404 from "../view/pages/errors/404";

export default function Router() {
    // Redux
    const customise = useSelector(state => state.customise);
    const auth = useSelector(state => state.auth);
    const dispatch = useDispatch();

    // Dark Mode
    useEffect(() => {
        document.querySelector("body").classList.add(customise.theme);
        dispatch(theme(customise.theme))
    }, []);

    // RTL
    useEffect(() => {
        if (customise.direction === "ltr") {
            document.querySelector("html").setAttribute("dir", "ltr");
        } else if (customise.direction === "rtl") {
            document.querySelector("html").setAttribute("dir", "rtl");
        }
    }, []);

    // Default Layout
    const DefaultLayout = customise.layout; // FullLayout or VerticalLayout

    // All of the available layouts
    const Layouts = {VerticalLayout, HorizontalLayout, FullLayout};

    // Return Filtered Array of Routes & Paths
    const LayoutRoutesAndPaths = (layout, isPrivateRoute = false) => {
        const LayoutRoutes = [];
        const LayoutPaths = [];
        if (Routes) {
            if (isPrivateRoute) {
                Routes.privateRoutes.filter(route => (route.layout === layout) && (
                    LayoutRoutes.push(route),
                        LayoutPaths.push(route.path)
                ));
            } else {
                // Checks if Route layout or Default layout matches current layout
                Routes.publicRoutes.filter(route => (route.layout === layout) && (
                    LayoutRoutes.push(route),
                        LayoutPaths.push(route.path)
                ));
            }
        }

        return {LayoutRoutes, LayoutPaths};
    };

    // Return Route to Render
    const ResolveRoutes = (privateRoutes = false) => {
        return Object.keys(Layouts).map((layout, index) => {
            const {LayoutRoutes, LayoutPaths}
                = LayoutRoutesAndPaths(layout, privateRoutes);

            let LayoutTag;
            if (DefaultLayout === "HorizontalLayout") {
                if (layout === "VerticalLayout") {
                    LayoutTag = Layouts["HorizontalLayout"];
                } else {
                    LayoutTag = Layouts[layout];
                }
            } else {
                LayoutTag = Layouts[layout];
            }

            return (<Route path={LayoutPaths} key={`pubR${index}`}>
                    <LayoutTag>
                        <Switch>
                            {LayoutRoutes.map((route) => {
                                return createRoute(route, privateRoutes);
                            })}
                        </Switch>
                    </LayoutTag>
                </Route>
            );
        });
    };

    const createRoute = (route, isPrivate = false) => {
        console.log("createRoute", isPrivate);
        return <Route
            key={`${isPrivate ? "pri" : "pub"}${route.path}`}
            path={route.path}
            exact={route.exact === true}
            render={(props) => {
                console.log("ROUTE", isPrivate, auth);
                if (!auth.user && isPrivate) {
                    return <Redirect to={{
                        pathname: "/auth/login"
                    }}/>
                } else if (!isPrivate && auth.user) {
                    const isRedirectIfAuth = route.redirectIfAuth ? route.redirectIfAuth : false;
                    if (isRedirectIfAuth) {
                        return <Redirect to={{
                            pathname: "/dashboard"
                        }}/>
                    }
                }

                return (
                    <Suspense fallback={null}>
                        {
                            route.layout === 'FullLayout' ? (
                                <route.component {...props} />
                            ) : (
                                <motion.div
                                    initial={{opacity: 0, y: 50}}
                                    animate={{opacity: 1, y: 0}}
                                    transition={{type: "spring", duration: 0.5, delay: 0.5}}
                                >
                                    <route.component {...props} />
                                </motion.div>
                            )
                        }
                    </Suspense>
                );
            }}
        />
    };

    return (
        <BrowserRouter>
            <Switch>
                {ResolveRoutes(false)}
                {ResolveRoutes(true)}
                {/* Home Page */}
                <Route
                    key={'r_home'}
                    exact
                    path={'/'}
                    render={() => {
                        return (<Layouts.FullLayout>
                            <Home/>
                        </Layouts.FullLayout>)
                    }}
                />

                {/* NotFound */}
                <Route key={'r_err'}
                       path='*'>
                    <Error404/>
                </Route>
            </Switch>
        </BrowserRouter>
    );
};