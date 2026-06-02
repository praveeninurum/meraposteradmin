"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

import Topbar from "@/components/Topbar";
import Icon from "@/components/Icon";

export default function AddLanguagePage() {
    const router = useRouter();

    const [saving, setSaving] =
        useState(false);

    const [form, setForm] =
        useState({
            name: "",
            native_name: "",
            iso_code: "",
        });

    const hasChanges = useMemo(() => {
        return (
            form.name.trim() !== "" ||
            form.native_name.trim() !== "" ||
            form.iso_code.trim() !== ""
        );
    }, [form]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setForm((prev) => ({
            ...prev,
            [e.target.name]:
                e.target.value,
        }));
    };

    const handleSave = async () => {
        try {
            if (
                !form.name.trim() ||
                !form.native_name.trim() ||
                !form.iso_code.trim()
            ) {
                alert(
                    "All fields are required"
                );
                return;
            }

            setSaving(true);

            await axios.post(
                "http://localhost:3000/api/language/add-language",
                {
                    name: form.name.trim(),
                    native_name:
                        form.native_name.trim(),
                    iso_code:
                        form.iso_code.trim(),
                }
            );

            alert(
                "Language added successfully"
            );

            router.push("/settings");
        } catch (error: any) {
            console.error(error);

            alert(
                error?.response?.data
                    ?.message ||
                "Failed to add language"
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDiscard = () => {
        setForm({
            name: "",
            native_name: "",
            iso_code: "",
        });
    };

    return (
        <>
            <Topbar placeholder="Add Language" />

            <main className="p-8 max-w-5xl mx-auto w-full pb-32">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() =>
                            router.push("/settings")
                        }
                        className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors mb-4"
                    >
                        <Icon
                            name="arrow_back"
                            size={18}
                        />
                        Back to Settings
                    </button>

                    <h1 className="text-[30px] font-extrabold font-headline text-on-surface">
                        Add Language
                    </h1>

                    <p className="text-sm text-on-surface-variant mt-1">
                        Add a new language
                        that users can select
                        inside the application.
                    </p>
                </div>

                {/* Form Card */}
                <div className="bg-surface-container-low rounded-DEFAULT p-8 relative overflow-hidden">
                    <div className="absolute -right-12 -top-12 w-48 h-48 bg-secondary-container/20 rounded-full blur-3xl" />

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-12 h-12 rounded-xl bg-secondary-container text-on-secondary-container flex items-center justify-center">
                                <Icon
                                    name="language"
                                    size={24}
                                />
                            </div>

                            <div>
                                <h2 className="font-bold text-xl font-headline">
                                    Language Details
                                </h2>

                                <p className="text-xs text-on-surface-variant">
                                    Configure basic
                                    language information
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            {/* Language Name */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">
                                    Language Name
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Hindi"
                                    className="w-full bg-surface-container-lowest rounded-DEFAULT p-4 outline-none border border-outline-variant/20 focus:ring-2 focus:ring-primary-fixed-dim"
                                />
                            </div>

                            {/* ISO */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">
                                    ISO Code
                                </label>

                                <input
                                    type="text"
                                    name="iso_code"
                                    value={
                                        form.iso_code
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="hi"
                                    className="w-full bg-surface-container-lowest rounded-DEFAULT p-4 outline-none border border-outline-variant/20 focus:ring-2 focus:ring-primary-fixed-dim"
                                />
                            </div>

                            {/* Native Name */}
                            <div className="col-span-2">
                                <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">
                                    Native Name
                                </label>

                                <input
                                    type="text"
                                    name="native_name"
                                    value={
                                        form.native_name
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="हिन्दी"
                                    className="w-full bg-surface-container-lowest rounded-DEFAULT p-4 outline-none border border-outline-variant/20 focus:ring-2 focus:ring-primary-fixed-dim"
                                />
                            </div>
                        </div>

                        {/* Preview */}
                        <div className="mt-8 p-5 rounded-DEFAULT bg-surface-container-lowest border border-outline-variant/10">
                            <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-3">
                                Preview
                            </p>

                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center text-xs font-bold">
                                    {form.iso_code
                                        ? form.iso_code.toUpperCase()
                                        : "--"}
                                </div>

                                <div>
                                    <p className="font-bold text-on-surface">
                                        {form.name ||
                                            "Language Name"}
                                    </p>

                                    <p className="text-xs text-on-surface-variant">
                                        {form.native_name ||
                                            "Native Name"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sticky Action Bar */}
                <div className="fixed bottom-8 right-8 z-30">
                    <div className="bg-white/90 backdrop-blur-xl border border-primary-fixed/30 p-2 rounded-full shadow-2xl flex items-center gap-2">
                        <button
                            disabled={
                                !hasChanges ||
                                saving
                            }
                            onClick={
                                handleDiscard
                            }
                            className="px-7 py-3 text-on-surface-variant font-bold hover:text-primary disabled:opacity-40"
                        >
                            Discard
                        </button>

                        <button
                            disabled={
                                !hasChanges ||
                                saving
                            }
                            onClick={handleSave}
                            className="px-8 py-3 text-white rounded-full font-bold flex items-center gap-2 disabled:opacity-40"
                            style={{
                                background:
                                    "linear-gradient(135deg,#a14200,#8d3900)",
                            }}
                        >
                            <Icon
                                name="save"
                                size={16}
                                className="text-white"
                            />

                            {saving
                                ? "Saving..."
                                : "Save Language"}
                        </button>
                    </div>
                </div>
            </main>
        </>
    );
}