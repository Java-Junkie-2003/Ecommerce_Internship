"use client";

import type { Route } from "../+types/root";
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { login } from "@/lib/api/api.login";
import { useAppDispatch } from "@/redux/hook";
import { addUserInfo } from "@/redux/slices/user";
import { getAccessToken, getRefreshToken } from "@/utils/token";
import { useState } from "react";
import { redirect, useNavigate, useParams } from "react-router";
import { toast } from "sonner";

const Page = () => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const dispatch = useAppDispatch();

    const params = useParams();
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            console.log("Logging in with:", { username, password });
            
            const { user, tokens } = await login({ username, password });
            
            console.log("Login successful:", { user, tokens });

            // Update Redux store with user info
            dispatch(addUserInfo(user));

            toast.success("Đăng nhập thành công!");

            // Navigate based on user role, delay 1s
            if (params.role === "admin" && user.roles.includes("ADMIN")) {
                console.log("Redirecting to dashboard for admin user", params.role);
                setTimeout(() => {
                    navigate("/dashboard");
                }, 1000);
            } else {
                console.log("Redirecting to home page for regular user", params.role);
                setTimeout(() => {
                    navigate("/");
                }, 1000);
            }

        } catch (error: any) {
            console.error("Login failed:", error);
            const errorMessage = error?.message || "Đăng nhập thất bại, vui lòng kiểm tra lại thông tin đăng nhập.";
            toast.error(errorMessage);
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleLogin();
        }
    }

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleLogin();
    }


    return (
        <div className="flex flex-col lg:flex-row items-center justify-center min-h-screen px-4 gap-8 lg:gap-16">
            <div className="w-full max-w-md p-4 text-center lg:text-left">
                <h1 className="text-6xl sm:text-8xl lg:text-[102px] mb-4">
                    <span className="text-dark font-semibold">
                        E
                    </span>
                    <span className="text-gray-500 font-semibold">
                        W
                    </span>
                    <span className="text-dark font-semibold">
                        .
                    </span>
                </h1>
            </div>
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>Đăng nhập</CardTitle>
                    <CardDescription>
                        Nhập email của bạn bên dưới để đăng nhập vào tài khoản của bạn
                    </CardDescription>
                    {/* <CardAction>
                        <Button variant="link">Đăng ký</Button>
                    </CardAction> */}
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleFormSubmit}>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Mật khẩu</Label>
                                    <a
                                        href="#"
                                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                                    >
                                        Quên mật khẩu?
                                    </a>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    required 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                />
                            </div>
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="flex-col gap-2">
                    <Button type="submit" className="w-full" onClick={handleLogin}>
                        Đăng nhập
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}

export default Page;

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "Đăng nhập" },
        { name: "description", content: "Đăng nhập vào tài khoản của bạn" },
    ];
}