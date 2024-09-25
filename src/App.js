import React, { Fragment, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { routes } from '~/routes';
import DefaultComponent from './components/DefaultComponent/DefaultComponent';
import Loading from './components/LoadingComponent/Loading';
function App() {
    return (
        <div>
            <Suspense fallback={<Loading />}>
                <Router>
                    <Routes>
                        {routes.map((route) => {
                            const Page = route.page;
                            const Layout = route.isShowSidebar ? DefaultComponent : Fragment;
                            return (
                                <Route
                                    key={route.path}
                                    path={route.path}
                                    element={
                                        <Layout>
                                            <Page />
                                        </Layout>
                                    }
                                />
                            );
                        })}
                    </Routes>
                </Router>
            </Suspense>
        </div>
    );
}

export default App;
