import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../../services/authService';

const LoginPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const result = await authService.login(formData.username, formData.password);
            if (result) {
                localStorage.setItem('user', JSON.Value ? JSON.stringify(result) : JSON.stringify(result));
                alert('Đăng nhập thành công!');
                navigate('/');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-background text-on-background font-body-md text-body-md antialiased min-h-screen flex flex-col">
            <main className="flex-grow flex w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 w-full min-h-screen">
                    {/* Left Side: Image */}
                    <div className="hidden md:block relative h-full bg-surface-container w-full">
                        <img 
                            alt="Minimalist Fashion" 
                            className="absolute inset-0 w-full h-full object-cover" 
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuD7QihfaxL2aopZuh2G8F_BmtS2DVALgr-7TG9xIQ88FgwWs6Kqp0GA6jj3GDlHJx9gZJeXcWVarI_4uCVuQUMfyqE7WSQMEkpVHLYkY1NFKiCq7T6j72zi2BQpJyxP71F9SnMg7-mWO2UACqHe_4MuZ9Z0HfBcsTtfdobKlsRLgRMpdJ52zEGr-6zhzlPevHDRdGLpWzuxTONOc6wOaPgWTfzssbEvsrLazzuWbf5FY3sp26s6Tz10zQQtCruNu1W5tlBWrst8kt0" 
                        />
                        <div className="absolute inset-0 bg-primary/10"></div>
                        <div className="absolute inset-0 flex flex-col justify-end p-margin pb-xl">
                            <span className="font-display-xl text-display-xl text-on-primary uppercase tracking-tighter mix-blend-difference">AnhCMS.Fashion</span>
                        </div>
                    </div>

                    {/* Right Side: Form Container */}
                    <div className="flex flex-col justify-center px-margin py-xl w-full max-w-md mx-auto md:max-w-none md:px-[10%] lg:px-[15%] bg-surface-container-lowest">
                        <div className="w-full max-w-sm mx-auto">
                            <div className="md:hidden mb-12 text-center">
                                <span className="font-display-xl-mobile text-display-xl-mobile text-primary uppercase tracking-tighter">AnhCMS.Fashion</span>
                            </div>

                            {/* Toggle */}
                            <div className="flex space-x-8 mb-12 border-b border-surface-variant pb-2">
                                <button className="font-headline-sm text-headline-sm text-primary border-b-2 border-primary pb-1 transition-colors bg-transparent border-0">Login</button>
                                <Link to="/register" className="font-headline-sm text-headline-sm text-secondary hover:text-primary transition-colors text-decoration-none">Register</Link>
                            </div>

                            {error && <div className="alert alert-danger mb-4 text-sm py-2">{error}</div>}

                            {/* Form */}
                            <form className="space-y-6" onSubmit={handleSubmit}>
                                <div className="relative">
                                    <input 
                                        className="peer block w-full appearance-none border-0 border-b border-secondary-container bg-transparent px-0 py-2 text-primary focus:border-primary focus:outline-none focus:ring-0 font-body-md text-body-md transition-colors" 
                                        id="username" 
                                        placeholder=" " 
                                        type="text" 
                                        required
                                        value={formData.username}
                                        onChange={handleInputChange}
                                    />
                                    <label className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-secondary duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-primary font-label-sm text-label-sm uppercase tracking-widest" htmlFor="username">
                                        Username
                                    </label>
                                </div>
                                <div className="relative mt-8">
                                    <input 
                                        className="peer block w-full appearance-none border-0 border-b border-secondary-container bg-transparent px-0 py-2 text-primary focus:border-primary focus:outline-none focus:ring-0 font-body-md text-body-md transition-colors" 
                                        id="password" 
                                        placeholder=" " 
                                        type="password" 
                                        required
                                        value={formData.password}
                                        onChange={handleInputChange}
                                    />
                                    <label className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-secondary duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-primary font-label-sm text-label-sm uppercase tracking-widest" htmlFor="password">
                                        Password
                                    </label>
                                </div>

                                <div className="flex items-center justify-between mt-6">
                                    <div className="flex items-center">
                                        <input className="h-4 w-4 rounded-none border-secondary-container text-primary focus:ring-primary bg-transparent focus:ring-offset-0 focus:ring-1" id="remember-me" type="checkbox" />
                                        <label className="ml-2 block font-body-md text-body-md text-secondary" htmlFor="remember-me">
                                            Remember Me
                                        </label>
                                    </div>
                                    <div className="text-sm">
                                        <a className="font-body-md text-body-md text-secondary hover:text-primary transition-colors hover:underline underline-offset-4" href="#">Forgot Password?</a>
                                    </div>
                                </div>

                                <div className="pt-6">
                                    <button 
                                        className="w-full bg-primary text-on-primary py-4 px-6 font-label-sm text-label-sm uppercase tracking-widest rounded-none hover:bg-transparent hover:text-primary border border-primary transition-all duration-300" 
                                        type="submit"
                                        disabled={loading}
                                    >
                                        {loading ? 'Processing...' : 'Login'}
                                    </button>
                                </div>

                                <div className="relative my-8">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-surface-variant"></div>
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="bg-surface-container-lowest px-4 text-secondary font-label-sm text-label-sm uppercase tracking-widest">Or</span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <button className="w-full flex items-center justify-center bg-transparent border border-primary text-primary py-3 px-6 font-label-sm text-label-sm uppercase tracking-widest rounded-none hover:bg-primary hover:text-on-primary transition-all duration-300 group" type="button">
                                        Continue with Google
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default LoginPage;
