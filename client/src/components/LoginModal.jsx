import React, { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import axios from 'axios'
import toast from 'react-hot-toast'

const LoginModal = ({ isOpen, setIsOpen, setIsLogin }) => {
    const [isLogin, setIsLoginLocal] = useState(true) // Local toggle for Login & Signup
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    })

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        console.log('Submitting Data:', formData);
        
        // Basic validation
        if (!formData.email || !formData.password || (!isLogin && !formData.name)) {
            toast.error('Please fill in all required fields')
            return
        }

        try {
            const url = isLogin 
                ? 'http://localhost:8080/api/auth/login' 
                : 'http://localhost:8080/api/auth/signup'

            const response = await axios.post(url, formData, {
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.data.token) {
                // Store auth token
                localStorage.setItem('token', response.data.token)
                axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`
                
                setIsLogin(true) // ✅ Update `Navbar` state
                window.dispatchEvent(new Event('storage')); // ✅ Ensure state updates globally
            }

            toast.success(response.data.message || (isLogin ? 'Login successful!' : 'Signup successful!'))
            console.log(response.data.message)

            setIsLogin(true);
            setIsOpen(false) // ✅ Close modal

        } catch (error) {
            console.error('Auth error:', error);
    
            if (error.code === 'ERR_NETWORK') {
                toast.error('Cannot connect to server. Please try again later.');
                return;
            }
    
            if (error.response?.status === 500) {
                console.error('Server Response:', error.response?.data);
                toast.error('Server error. Please try again later.');
                return;
            }
    
            toast.error(
                error.response?.data?.message || 'Authentication failed. Please check your credentials.'
            );
        }
    }

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as='div' open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
                <div className="fixed inset-0 bg-black/50 transition-opacity" aria-hidden="true" />
                
                <div className="fixed inset-0 overflow-y-auto flex items-center justify-center p-4">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <Dialog.Panel className="rounded-md bg-white max-w-md w-full shadow-lg p-8">
                            <Dialog.Title className="text-2xl font-semibold text-center">
                                {isLogin ? 'Login to Your Account' : 'Create an Account'}
                            </Dialog.Title>

                            <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
                                {!isLogin && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full p-2 border border-gray-300 rounded"
                                            required
                                        />
                                    </div>
                                )}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-300 rounded"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-300 rounded"
                                        required
                                    />
                                </div>
                                <button type="submit" className="w-full text-indigo-50 bg-indigo-500 text-sm px-4 py-2 border border-indigo-500 rounded-md hover:bg-indigo-600/90 transition-colors focus:outline-none focus:ring focus:ring-indigo-300 focus:ring-offset-1">
                                    {isLogin ? 'Login' : 'Sign Up'}
                                </button>
                            </form>

                            <div className="mt-4 text-center text-sm text-gray-600">
                                {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                                <button onClick={() => setIsLoginLocal(!isLogin)} className="text-indigo-500 hover:underline">
                                    {isLogin ? 'Sign up' : 'Login'}
                                </button>
                            </div>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    )
}

export default LoginModal
