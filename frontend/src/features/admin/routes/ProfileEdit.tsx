import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { z } from "zod";
import ContentWrapper from "@/components/Layout/AdminLayout/ContentWrapper";
import { Button } from "@/components/Elements";
import { Spinner } from "@/components/Elements/Spinner";
import { useUser } from "@/lib/auth";
import { Form, InputField, TextAreaField } from "@/components/Form";
import { useUpdateProfile } from "../hooks/useUpdateProfile";
import { useChangePassword } from "../hooks/useChangePassword";

type TabType = "profile" | "password";

const profileSchema = z.object({
    name: z.string().min(1, "Display Name is required"),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    email: z.string().min(1, "Email is required").email("Invalid email format"),
    phone: z.string().optional(),
    address: z.string().optional(),
});

const passwordSchema = z
    .object({
        oldPassword: z.string().min(1, "Current password is required"),
        newPassword: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .regex(/[a-zA-Z]/, "Must contain at least one letter")
            .regex(/\d/, "Must contain at least one number"),
        confirmPassword: z.string().min(1, "Please confirm your new password"),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    })
    .refine((data) => data.oldPassword !== data.newPassword, {
        message: "New password cannot be the same as the current password",
        path: ["newPassword"],
    });

type ProfileValues = z.infer<typeof profileSchema>;
type PasswordValues = z.infer<typeof passwordSchema>;

export const ProfileEdit = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const user = useUser();
    const updateProfileMutation = useUpdateProfile();
    const changePasswordMutation = useChangePassword();

    const [activeTab, setActiveTab] = useState<TabType>("profile");

    // Set active tab from URL params
    useEffect(() => {
        const tab = searchParams.get("tab");
        if (tab === "password") {
            setActiveTab("password");
        }
    }, [searchParams]);

    if (user?.isLoading) {
        return (
            <ContentWrapper title="Edit Profile">
                <div
                    className="d-flex justify-content-center align-items-center"
                    style={{ minHeight: "400px" }}
                >
                    <Spinner size="lg" />
                </div>
            </ContentWrapper>
        );
    }

    return (
        <ContentWrapper title="Edit Profile">
            <div className="profile-edit">
                {/* Header Section */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div className="d-flex align-items-center gap-3">
                        <button
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => navigate("/admin/profile")}
                        >
                            <i className="fa-solid fa-arrow-left"></i>
                        </button>
                        <h2 className="text-white f-24 semi-bold mb-0">Edit Profile</h2>
                    </div>
                </div>

                {/* Profile Card */}
                <div className="cardbg rounded-lg overflow-hidden">
                    {/* Tabs */}
                    <div className="profile-tabs d-flex border-btm">
                        <button
                            className={`tab-btn px-4 py-3 ${activeTab === "profile" ? "active" : ""}`}
                            onClick={() => setActiveTab("profile")}
                        >
                            <i className="fa-solid fa-user me-2"></i>
                            Profile Information
                        </button>
                        <button
                            className={`tab-btn px-4 py-3 ${activeTab === "password" ? "active" : ""}`}
                            onClick={() => setActiveTab("password")}
                        >
                            <i className="fa-solid fa-key me-2"></i>
                            Change Password
                        </button>
                    </div>

                    {/* Profile Tab Content */}
                    {activeTab === "profile" && (
                        <div className="p-4">
                            <div className="text-center mb-4">
                                <div className="profile-avatar-edit mx-auto mb-3">
                                    {user?.data?.image ? (
                                        <img
                                            src={user.data.image}
                                            alt={user.data.name}
                                            className="rounded-circle"
                                            style={{ width: "120px", height: "120px", objectFit: "cover" }}
                                        />
                                    ) : (
                                        <div
                                            className="avatar-placeholder rounded-circle d-flex align-items-center justify-content-center mx-auto"
                                            style={{
                                                width: "120px",
                                                height: "120px",
                                                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                                fontSize: "3rem",
                                                color: "#fff",
                                                fontWeight: "600",
                                            }}
                                        >
                                            {user?.data?.name?.charAt(0)?.toUpperCase() || "A"}
                                        </div>
                                    )}
                                </div>
                                <p className="lighttxt small mb-0">Profile photo is managed through account settings</p>
                            </div>

                            <Form<ProfileValues, typeof profileSchema>
                                onSubmit={async (values) => {
                                    await updateProfileMutation.mutateAsync({
                                        ...values,
                                        firstName: values.firstName || "",
                                        lastName: values.lastName || "",
                                        phone: values.phone || "",
                                        address: values.address || "",
                                    });
                                    navigate("/admin/profile");
                                }}
                                schema={profileSchema}
                                options={{
                                    defaultValues: {
                                        name: user?.data?.name || "",
                                        firstName: user?.data?.firstName || "",
                                        lastName: user?.data?.lastName || "",
                                        email: user?.data?.email || "",
                                        phone: user?.data?.phone || "",
                                        address: user?.data?.address || "",
                                    },
                                }}
                            >
                                {({ register, formState: { errors } }) => (
                                    <>
                                        <div className="row g-4">
                                            {/* Name Field */}
                                            <div className="col-md-12">
                                                <label className="form-label text-white">
                                                    Display Name <span className="text-danger">*</span>
                                                </label>
                                                <InputField
                                                    registration={register("name")}
                                                    error={errors.name}
                                                    placeholder="Enter your display name"
                                                />
                                            </div>

                                            {/* First Name */}
                                            <div className="col-md-6">
                                                <label className="form-label text-white">First Name</label>
                                                <InputField
                                                    registration={register("firstName")}
                                                    error={errors.firstName}
                                                    placeholder="Enter first name"
                                                />
                                            </div>

                                            {/* Last Name */}
                                            <div className="col-md-6">
                                                <label className="form-label text-white">Last Name</label>
                                                <InputField
                                                    registration={register("lastName")}
                                                    error={errors.lastName}
                                                    placeholder="Enter last name"
                                                />
                                            </div>

                                            {/* Email */}
                                            <div className="col-md-6">
                                                <label className="form-label text-white">
                                                    Email Address <span className="text-danger">*</span>
                                                </label>
                                                <InputField
                                                    registration={register("email")}
                                                    error={errors.email}
                                                    placeholder="Enter email address"
                                                    type="email"
                                                />
                                            </div>

                                            {/* Phone */}
                                            <div className="col-md-6">
                                                <label className="form-label text-white">Phone Number</label>
                                                <InputField
                                                    registration={register("phone")}
                                                    error={errors.phone}
                                                    placeholder="Enter phone number"
                                                    type="phone"
                                                />
                                            </div>

                                            {/* Address */}
                                            <div className="col-12">
                                                <label className="form-label text-white">Address</label>
                                                <TextAreaField
                                                    registration={register("address")}
                                                    error={errors.address}
                                                    placeholder="Enter your address"
                                                    rows={3}
                                                />
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="d-flex gap-3 justify-content-end mt-4 pt-4 border-top" style={{ borderColor: "rgba(255,255,255,0.1) !important" }}>
                                            <Button
                                                variant="outline"
                                                type="button"
                                                onClick={() => navigate("/admin/profile")}
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                variant="primary"
                                                type="submit"
                                                isLoading={updateProfileMutation.isLoading}
                                            >
                                                Save Changes
                                            </Button>
                                        </div>
                                    </>
                                )}
                            </Form>
                        </div>
                    )}

                    {/* Password Tab Content */}
                    {activeTab === "password" && (
                        <div className="p-4">
                            <div className="security-info mb-4 p-3 rounded" style={{ background: "rgba(102, 126, 234, 0.1)", border: "1px solid rgba(102, 126, 234, 0.3)" }}>
                                <div className="d-flex align-items-start gap-3">
                                    <i className="fa-solid fa-shield-halved" style={{ color: "#667eea", fontSize: "1.5rem" }}></i>
                                    <div>
                                        <h5 className="text-white f-16 mb-1">Password Requirements</h5>
                                        <ul className="lighttxt mb-0 ps-3" style={{ fontSize: "0.875rem" }}>
                                            <li>Minimum 8 characters long</li>
                                            <li>Must contain at least one letter</li>
                                            <li>Must contain at least one number</li>
                                            <li>Cannot be the same as your current password</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <Form<PasswordValues, typeof passwordSchema>
                                onSubmit={async (values, methods) => {
                                    await changePasswordMutation.mutateAsync({
                                        oldPassword: values.oldPassword,
                                        newPassword: values.newPassword,
                                    });
                                    methods.reset();
                                    navigate("/admin/profile");
                                }}
                                schema={passwordSchema}
                            >
                                {({ register, formState: { errors } }) => (
                                    <>
                                        <div className="row g-4">
                                            {/* Current Password */}
                                            <div className="col-12">
                                                <label className="form-label text-white">
                                                    Current Password <span className="text-danger">*</span>
                                                </label>
                                                <InputField
                                                    registration={register("oldPassword")}
                                                    error={errors.oldPassword}
                                                    placeholder="Enter current password"
                                                    type="password"
                                                />
                                            </div>

                                            {/* New Password */}
                                            <div className="col-md-6">
                                                <label className="form-label text-white">
                                                    New Password <span className="text-danger">*</span>
                                                </label>
                                                <InputField
                                                    registration={register("newPassword")}
                                                    error={errors.newPassword}
                                                    placeholder="Enter new password"
                                                    type="password"
                                                />
                                            </div>

                                            {/* Confirm Password */}
                                            <div className="col-md-6">
                                                <label className="form-label text-white">
                                                    Confirm New Password <span className="text-danger">*</span>
                                                </label>
                                                <InputField
                                                    registration={register("confirmPassword")}
                                                    error={errors.confirmPassword}
                                                    placeholder="Confirm new password"
                                                    type="password"
                                                />
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="d-flex gap-3 justify-content-end mt-4 pt-4 border-top" style={{ borderColor: "rgba(255,255,255,0.1) !important" }}>
                                            <Button
                                                variant="outline"
                                                type="button"
                                                onClick={() => navigate("/admin/profile")}
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                variant="primary"
                                                type="submit"
                                                isLoading={changePasswordMutation.isLoading}
                                            >
                                                Update Password
                                            </Button>
                                        </div>
                                    </>
                                )}
                            </Form>
                        </div>
                    )}
                </div>
            </div>

            {/* Custom Styles */}
            <style>{`
                .profile-edit .tab-btn {
                    background: transparent;
                    border: none;
                    color: rgba(255,255,255,0.6);
                    font-weight: 500;
                    position: relative;
                    transition: all 0.3s ease;
                }
                .profile-edit .tab-btn:hover {
                    color: #fff;
                    background: rgba(255,255,255,0.05);
                }
                .profile-edit .tab-btn.active {
                    color: #fff;
                }
                .profile-edit .tab-btn.active::after {
                    content: '';
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    height: 3px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border-radius: 3px 3px 0 0;
                }
                .profile-edit .form-control {
                    background: rgba(255,255,255,0.05);
                    border-color: rgba(255,255,255,0.1);
                    color: #fff;
                }
                .profile-edit .form-control:focus {
                    background: rgba(255,255,255,0.08);
                    border-color: #667eea;
                    color: #fff;
                    box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
                }
                .profile-edit .form-control::placeholder {
                    color: rgba(255,255,255,0.4);
                }
                .profile-edit .input-group .btn-outline-secondary {
                    border-color: rgba(255,255,255,0.1);
                    color: rgba(255,255,255,0.6);
                }
                .profile-edit .input-group .btn-outline-secondary:hover {
                    background: rgba(255,255,255,0.1);
                    color: #fff;
                }
                .profile-edit .border-top {
                    border-color: rgba(255,255,255,0.1) !important;
                }
            `}</style>
        </ContentWrapper>
    );
};
