import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../../context/AuthContext';
import { loginSchema, type LoginFormData } from '../../schemas/loginSchema';

const LoginPage: React.FC = () => {
    const [error, setError] = React.useState<string>('');
    const [loading, setLoading] = React.useState<boolean>(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        setError('');
        setLoading(true);
        try {
            await login(data.username, data.password);
            navigate('/');
        } catch {
            setError('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-background text-on-background font-body-md antialiased pt-20 flex flex-col min-h-screen">
            <main className="flex-1 flex items-center justify-center p-sm py-20">
                <div className="w-full max-w-md space-y-xl">
                    <div className="text-center space-y-md">
                        <div className="inline-flex size-16 bg-black items-center justify-center mb-4">
                            <svg className="text-white size-10" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                <path d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z" fill="currentColor"></path>
                            </svg>
                        </div>
                        <h1 className="serif text-4xl font-bold tracking-tighter uppercase">AnhCMS.Fashion</h1>
                        <p className="text-[10px] text-secondary uppercase tracking-[0.4em] font-bold">Secure Personnel Authentication</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="bg-surface-container-lowest border border-outline-variant p-lg space-y-lg">
                        <div className="space-y-sm">
                            <label className="text-[10px] uppercase tracking-widest text-secondary font-bold">Identity Code</label>
                            <input
                                type="text"
                                {...register('username')}
                                className="w-full bg-surface-container-low border-none focus:ring-1 focus:ring-primary px-md py-4 text-sm font-semibold tracking-widest uppercase placeholder:text-outline-variant"
                                placeholder="Username"
                            />
                            {errors.username && <p className="text-error text-[10px] uppercase tracking-widest font-bold mt-1">{errors.username.message}</p>}
                        </div>

                        <div className="space-y-sm">
                            <label className="text-[10px] uppercase tracking-widest text-secondary font-bold">Security Token</label>
                            <input
                                type="password"
                                {...register('password')}
                                className="w-full bg-surface-container-low border-none focus:ring-1 focus:ring-primary px-md py-4 text-sm tracking-widest placeholder:text-outline-variant"
                                placeholder="Password"
                            />
                            {errors.password && <p className="text-error text-[10px] uppercase tracking-widest font-bold mt-1">{errors.password.message}</p>}
                        </div>

                        {error && (
                            <div className="p-md bg-error-container text-error text-[10px] uppercase tracking-widest font-bold text-center">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary text-on-primary py-4 text-[10px] font-bold uppercase tracking-[0.3em] border border-primary outline-none disabled:opacity-50 btn-luxury btn-primary-luxury"
                        >
                            {loading ? 'Authenticating...' : 'Authenticate'}
                        </button>

                        <div className="text-center pt-4 border-t border-outline-variant">
                            <p className="text-[10px] text-secondary uppercase tracking-widest">
                                New Member? <Link to="/register" className="text-primary font-bold hover:underline ml-2">Register Access</Link>
                            </p>
                        </div>
                    </form>

                    <div className="text-center">
                        <p className="text-[10px] text-outline uppercase tracking-widest">© 2024 International Holdings. All Rights Reserved.</p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default LoginPage;
