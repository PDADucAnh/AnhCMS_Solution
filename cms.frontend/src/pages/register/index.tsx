import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import authService from '../../services/authService';
import toast from 'react-hot-toast';
import { registerSchema, type RegisterFormData } from '../../schemas/registerSchema';

const RegisterPage: React.FC = () => {
    const [error, setError] = React.useState<string>('');
    const [loading, setLoading] = React.useState<boolean>(false);
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterFormData) => {
        setError('');
        setLoading(true);
        try {
            const success = await authService.register({
                username: data.username,
                fullName: data.fullName,
                email: data.email,
                password: data.password,
            });
            if (success) {
                toast.success('Account commissioned successfully. Please authenticate.');
                navigate('/login');
            } else {
                setError('Registration failed. Identity code may already be in use.');
            }
        } catch {
            setError('An error occurred during commissioning.');
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
                        <p className="text-[10px] text-neutral-500 uppercase tracking-[0.4em] font-bold">New Identity Commissioning</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="bg-white border border-neutral-200 p-lg space-y-lg shadow-sm">
                        <div className="space-y-sm">
                            <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Identity Code (Username)</label>
                            <input
                                type="text"
                                {...register('username')}
                                className="w-full bg-neutral-50 border-none focus:ring-1 focus:ring-black px-md py-4 text-sm font-semibold tracking-widest uppercase placeholder:text-neutral-300"
                                placeholder="Username"
                            />
                            {errors.username && <p className="text-red-600 text-[10px] uppercase tracking-widest font-bold mt-1">{errors.username.message}</p>}
                        </div>

                        <div className="space-y-sm">
                            <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Full Nomenclature</label>
                            <input
                                type="text"
                                {...register('fullName')}
                                className="w-full bg-neutral-50 border-none focus:ring-1 focus:ring-black px-md py-4 text-sm font-semibold tracking-widest uppercase placeholder:text-neutral-300"
                                placeholder="Full Name"
                            />
                            {errors.fullName && <p className="text-red-600 text-[10px] uppercase tracking-widest font-bold mt-1">{errors.fullName.message}</p>}
                        </div>

                        <div className="space-y-sm">
                            <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Electronic Mail</label>
                            <input
                                type="email"
                                {...register('email')}
                                className="w-full bg-neutral-50 border-none focus:ring-1 focus:ring-black px-md py-4 text-sm tracking-widest placeholder:text-neutral-300"
                                placeholder="Email"
                            />
                            {errors.email && <p className="text-red-600 text-[10px] uppercase tracking-widest font-bold mt-1">{errors.email.message}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                            <div className="space-y-sm">
                                <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Security Token</label>
                                <input
                                    type="password"
                                    {...register('password')}
                                    className="w-full bg-neutral-50 border-none focus:ring-1 focus:ring-black px-md py-4 text-sm tracking-widest placeholder:text-neutral-300"
                                    placeholder="Password"
                                />
                                {errors.password && <p className="text-red-600 text-[10px] uppercase tracking-widest font-bold mt-1">{errors.password.message}</p>}
                            </div>
                            <div className="space-y-sm">
                                <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Verify Token</label>
                                <input
                                    type="password"
                                    {...register('confirmPassword')}
                                    className="w-full bg-neutral-50 border-none focus:ring-1 focus:ring-black px-md py-4 text-sm tracking-widest placeholder:text-neutral-300"
                                    placeholder="Confirm"
                                />
                                {errors.confirmPassword && <p className="text-red-600 text-[10px] uppercase tracking-widest font-bold mt-1">{errors.confirmPassword.message}</p>}
                            </div>
                        </div>

                        {error && (
                            <div className="p-md bg-red-50 border border-red-100 text-red-600 text-[10px] uppercase tracking-widest font-bold text-center">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-black text-white py-4 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-neutral-800 transition-all border-0 outline-none"
                        >
                            {loading ? 'Commissioning...' : 'Commission Account'}
                        </button>

                        <div className="text-center pt-4 border-t border-outline-variant">
                            <p className="text-[10px] text-secondary uppercase tracking-widest">
                                Already Commissioned? <Link to="/login" className="text-primary font-bold hover:underline ml-2">Authenticate Access</Link>
                            </p>
                        </div>
                    </form>

                    <div className="text-center">
                        <p className="text-[10px] text-neutral-400 uppercase tracking-widest">© 2024 International Holdings. All Rights Reserved.</p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default RegisterPage;
