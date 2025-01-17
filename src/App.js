import React, { Fragment, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { routes } from '~/routes';
import DefaultComponent from './components/DefaultComponent/DefaultComponent';
// import Loading from './components/LoadingComponent/Loading';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ToastContainer } from 'react-toastify';
import NotFound from './pages/NotFoundPage/NotFound';
const queryClient = new QueryClient();
function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <Suspense
            // fallback={<Loading />}
            >
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
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                    <ToastContainer
                        position="top-right"
                        autoClose={2000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                    />
                </Router>
            </Suspense>
        </QueryClientProvider>
    );
}

export default App;
