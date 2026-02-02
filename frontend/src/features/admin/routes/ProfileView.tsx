import { useNavigate } from "react-router-dom";
import ContentWrapper from "@/components/Layout/AdminLayout/ContentWrapper";
import { Button } from "@/components/Elements";
import { Spinner } from "@/components/Elements/Spinner";
import { useUser } from "@/lib/auth";

export const ProfileView = () => {
    const navigate = useNavigate();
    const user = useUser();

    const profile = user?.data;
    const isLoading = user?.isLoading;

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    if (isLoading) {
        return (
            <ContentWrapper title="My Profile">
                <div
                    className="d-flex justify-content-center align-items-center"
                    style={{ minHeight: "400px" }}
                >
                    <Spinner size="lg" />
                </div>
            </ContentWrapper>
        );
    }

    if (!profile) {
        return (
            <ContentWrapper title="My Profile">
                <div className="text-center p-5">
                    <i className="fa-solid fa-exclamation-circle fa-3x mb-3 text-warning"></i>
                    <p className="text-white">Profile not found</p>
                    <Button variant="primary" onClick={() => navigate("/admin")}>
                        Go to Dashboard
                    </Button>
                </div>
            </ContentWrapper>
        );
    }

    return (
        <ContentWrapper title="My Profile">
            <div className="profile-view">
                {/* Header Section */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div className="d-flex align-items-center gap-3">
                        <button
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => navigate("/admin")}
                        >
                            <i className="fa-solid fa-arrow-left"></i>
                        </button>
                        <h2 className="text-white f-24 semi-bold mb-0">My Profile</h2>
                    </div>
                    <div className="d-flex gap-2">
                        <Button
                            variant="primary"
                            onClick={() => navigate("/admin/profile/edit")}
                            startIcon={<i className="fa-solid fa-pen"></i>}
                        >
                            Edit Profile
                        </Button>
                    </div>
                </div>

                {/* Profile Card */}
                <div className="cardbg rounded-lg overflow-hidden">
                    {/* Profile Header with Avatar */}
                    <div className="profile-header p-4 border-btm">
                        <div className="d-flex align-items-center gap-4">
                            <div className="profile-avatar">
                                {profile.image ? (
                                    <img
                                        src={profile.image}
                                        alt={profile.name}
                                        className="rounded-circle"
                                        style={{ width: "100px", height: "100px", objectFit: "cover" }}
                                    />
                                ) : (
                                    <div
                                        className="avatar-placeholder rounded-circle d-flex align-items-center justify-content-center"
                                        style={{
                                            width: "100px",
                                            height: "100px",
                                            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                            fontSize: "2.5rem",
                                            color: "#fff",
                                            fontWeight: "600",
                                        }}
                                    >
                                        {profile.name?.charAt(0)?.toUpperCase() || "A"}
                                    </div>
                                )}
                            </div>
                            <div>
                                <h3 className="text-white f-24 semi-bold mb-1">
                                    {profile.firstName && profile.lastName
                                        ? `${profile.firstName} ${profile.lastName}`
                                        : profile.name}
                                </h3>
                                <p className="lighttxt mb-0">{profile.email}</p>
                                <span
                                    className="badge mt-2"
                                    style={{
                                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                        padding: "6px 16px",
                                        fontSize: "0.85rem",
                                        textTransform: "capitalize",
                                    }}
                                >
                                    {profile.role}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Profile Details */}
                    <div className="p-4">
                        <h4 className="text-white f-16 semi-bold mb-4">
                            <i className="fa-solid fa-user-circle me-2" style={{ color: "#667eea" }}></i>
                            Personal Information
                        </h4>
                        <div className="row g-4">
                            <div className="col-md-6">
                                <div className="info-card p-3 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                                    <span className="lighttxt small d-block mb-1">
                                        <i className="fa-solid fa-user me-2"></i>Full Name
                                    </span>
                                    <p className="text-white mb-0 f-16">
                                        {profile.firstName && profile.lastName
                                            ? `${profile.firstName} ${profile.lastName}`
                                            : profile.name || "Not provided"}
                                    </p>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="info-card p-3 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                                    <span className="lighttxt small d-block mb-1">
                                        <i className="fa-solid fa-envelope me-2"></i>Email Address
                                    </span>
                                    <p className="text-white mb-0 f-16">{profile.email}</p>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="info-card p-3 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                                    <span className="lighttxt small d-block mb-1">
                                        <i className="fa-solid fa-phone me-2"></i>Phone Number
                                    </span>
                                    <p className="text-white mb-0 f-16">{profile.phone || "Not provided"}</p>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="info-card p-3 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                                    <span className="lighttxt small d-block mb-1">
                                        <i className="fa-solid fa-map-marker-alt me-2"></i>Address
                                    </span>
                                    <p className="text-white mb-0 f-16">{profile.address || "Not provided"}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Account Information */}
                    <div className="p-4 border-top" style={{ borderColor: "rgba(255,255,255,0.1) !important" }}>
                        <h4 className="text-white f-16 semi-bold mb-4">
                            <i className="fa-solid fa-shield-halved me-2" style={{ color: "#667eea" }}></i>
                            Account Information
                        </h4>
                        <div className="row g-4">
                            <div className="col-md-6">
                                <div className="info-card p-3 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                                    <span className="lighttxt small d-block mb-1">
                                        <i className="fa-solid fa-user-tag me-2"></i>Role
                                    </span>
                                    <p className="text-white mb-0 f-16" style={{ textTransform: "capitalize" }}>
                                        {profile.role}
                                    </p>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="info-card p-3 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                                    <span className="lighttxt small d-block mb-1">
                                        <i className="fa-solid fa-circle-check me-2"></i>Status
                                    </span>
                                    <span
                                        className={`badge ${profile.status === "Active" ? "bg-success" : "bg-secondary"}`}
                                    >
                                        {profile.status || "Active"}
                                    </span>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="info-card p-3 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                                    <span className="lighttxt small d-block mb-1">
                                        <i className="fa-solid fa-calendar-plus me-2"></i>Member Since
                                    </span>
                                    <p className="text-white mb-0 f-16">
                                        {profile.createdAt ? formatDate(profile.createdAt) : "N/A"}
                                    </p>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="info-card p-3 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                                    <span className="lighttxt small d-block mb-1">
                                        <i className="fa-solid fa-clock-rotate-left me-2"></i>Last Updated
                                    </span>
                                    <p className="text-white mb-0 f-16">
                                        {profile.updatedAt ? formatDate(profile.updatedAt) : "N/A"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="p-4 border-top" style={{ borderColor: "rgba(255,255,255,0.1) !important" }}>
                        <h4 className="text-white f-16 semi-bold mb-4">
                            <i className="fa-solid fa-bolt me-2" style={{ color: "#667eea" }}></i>
                            Quick Actions
                        </h4>
                        <div className="d-flex gap-3 flex-wrap">
                            <Button
                                variant="outline"
                                onClick={() => navigate("/admin/profile/edit")}
                                startIcon={<i className="fa-solid fa-pen-to-square"></i>}
                            >
                                Edit Profile
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => navigate("/admin/profile/edit?tab=password")}
                                startIcon={<i className="fa-solid fa-key"></i>}
                            >
                                Change Password
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Custom Styles */}
            <style>{`
                .profile-view .info-card {
                    transition: all 0.3s ease;
                    border: 1px solid rgba(255,255,255,0.05);
                }
                .profile-view .info-card:hover {
                    background: rgba(255,255,255,0.06) !important;
                    border-color: rgba(102, 126, 234, 0.3);
                    transform: translateY(-2px);
                }
                .profile-view .border-top {
                    border-color: rgba(255,255,255,0.1) !important;
                }
            `}</style>
        </ContentWrapper>
    );
};
