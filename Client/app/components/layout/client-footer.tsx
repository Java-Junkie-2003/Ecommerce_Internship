import { Mail, PhoneCall } from "lucide-react";

export default function SiteFooter() {
    return (
        <footer className="bg-white border-t border-gray-200 py-12">
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="md:col-span-2">
                        <div className="text-3xl font-bold mb-4">
                            <span className="text-dark font-semibold">
                                E
                            </span>
                            <span className="text-gray-500 font-semibold">
                                W
                            </span>
                            <span className="text-dark font-semibold">
                                .
                            </span>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                            dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
                            ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
                            fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
                            deserunt mollit anim id est laborum.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-medium mb-4">Links</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <a href="#" className="hover:text-gray-600">
                                    TEXT TO LINK
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-gray-600">
                                    TEXT TO LINK
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-medium mb-4">Liên hệ</h4>
                        <div className="space-y-3 mb-4">
                            <div className="flex items-center space-x-2 text-sm">
                                <PhoneCall className="h-4 w-4" />
                                <span>0987654321</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm">
                                <Mail className="h-4 w-4" />
                                <span>ewsupport@ew.com</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-200 mt-8 pt-8 text-center text-sm text-gray-600">
                    Copyright 2023 © EWCommerce.com
                </div>
            </div>
        </footer>
    )
}