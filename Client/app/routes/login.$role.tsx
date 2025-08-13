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
import { ApiService } from "@/lib/api/api.service";
import { useAppDispatch } from "@/redux/hook";
import { addUserInfo } from "@/redux/slices/user";
import { LoginResponseDTO } from "@/types/dto/login.dto";
import { getAccessToken, getRefreshToken, setAccessToken, setRefreshToken } from "@/utils/token";
import { useState } from "react";
import { ClientLoaderFunction, ClientLoaderFunctionArgs, LoaderFunctionArgs, redirect } from "react-router";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
    const token = getAccessToken();
    const refreshToken = getRefreshToken();

    if (token || refreshToken) {

        if(params.role === "admin") {
            return redirect("/admin");
        } else {
            return redirect("/dashboard");
        }
    }

    return null;
}

const Page = () => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const dispatch = useAppDispatch();

    const handleLogin = async () => {
        console.log("Logging in with:", { username, password });
        const res: LoginResponseDTO = await ApiService.post("/auth/login", { username, password });
        if (res.statusCode === 200) {
            console.log("Login successful:", res);

            const { user, tokens } = res.metadata;

            dispatch(addUserInfo(user));

            setAccessToken(tokens.accessToken);
            setRefreshToken(tokens.refreshToken);

        } else {
            console.error("Login failed:", res);

        }
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
                    <form>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
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
                                    required value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)}
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