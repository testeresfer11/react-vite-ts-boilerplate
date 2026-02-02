import { useNavigate, useParams } from "react-router-dom";
import ContentWrapper from "@/components/Layout/AdminLayout/ContentWrapper";
import { Button } from "@/components/Elements";
import { Spinner } from "@/components/Elements/Spinner";
import { useContent } from "../hooks/useContent";

export const ContentView = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    // React Query hook
    const { data: contentResponse, isLoading, isError } = useContent(id || "");
    const content = contentResponse?.data;

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
            <ContentWrapper title="View Content">
                <div
                    className="d-flex justify-content-center align-items-center"
                    style={{ minHeight: "400px" }}
                >
                    <Spinner size="lg" />
                </div>
            </ContentWrapper>
        );
    }

    if (isError || !content) {
        return (
            <ContentWrapper title="View Content">
                <div className="text-center p-5">
                    <i className="fa-solid fa-exclamation-circle fa-3x mb-3 text-warning"></i>
                    <p className="text-white">Content not found</p>
                    <Button variant="primary" onClick={() => navigate("/admin/content")}>
                        Back to List
                    </Button>
                </div>
            </ContentWrapper>
        );
    }

    return (
        <ContentWrapper title="View Content">
            <div className="content-view">
                {/* Header Section */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div className="d-flex align-items-center gap-3">
                        <button
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => navigate("/admin/content")}
                        >
                            <i className="fa-solid fa-arrow-left"></i>
                        </button>
                        <h2 className="text-white f-24 semi-bold mb-0">View Content</h2>
                    </div>
                    <div className="d-flex gap-2">
                        <Button
                            variant="primary"
                            onClick={() => navigate(`/admin/content/edit/${id}`)}
                            startIcon={<i className="fa-solid fa-pen"></i>}
                        >
                            Edit
                        </Button>
                    </div>
                </div>

                {/* Content Details Card */}
                <div className="cardbg rounded-lg overflow-hidden">
                    {/* Header */}
                    <div className="border-btm p-4">
                        <div className="d-flex justify-content-between align-items-start">
                            <div>
                                <h3 className="text-white f-20 semi-bold mb-2">
                                    {content.name}
                                </h3>
                                <p className="lighttxt mb-0">{content.description}</p>
                            </div>
                            <div className="text-end">
                                <span className="badge bg-primary">Content</span>
                            </div>
                        </div>
                    </div>

                    {/* Meta Info */}
                    <div className="border-btm p-4 d-flex gap-4">
                        <div>
                            <span className="lighttxt small">Created At</span>
                            <p className="text-white mb-0">{formatDate(content.createdAt)}</p>
                        </div>
                        <div>
                            <span className="lighttxt small">Last Updated</span>
                            <p className="text-white mb-0">{formatDate(content.updatedAt)}</p>
                        </div>
                    </div>

                    {/* Content Body */}
                    <div className="p-4">
                        <h4 className="text-white f-16 semi-bold mb-3">Content</h4>
                        <div
                            className="content-html-preview p-4 rounded"
                            style={{
                                background: "rgba(255, 255, 255, 0.05)",
                                border: "1px solid var(--bs-border-color)",
                            }}
                            dangerouslySetInnerHTML={{ __html: content.content }}
                        />
                    </div>
                </div>
            </div>

            {/* Custom Styles for HTML Preview */}
            <style>{`
        .content-html-preview {
          color: #fff;
          line-height: 1.8;
        }
        .content-html-preview h1,
        .content-html-preview h2,
        .content-html-preview h3,
        .content-html-preview h4,
        .content-html-preview h5,
        .content-html-preview h6 {
          color: #fff;
          margin-bottom: 1rem;
        }
        .content-html-preview p {
          margin-bottom: 1rem;
        }
        .content-html-preview a {
          color: var(--bs-primary);
        }
        .content-html-preview ul,
        .content-html-preview ol {
          padding-left: 1.5rem;
          margin-bottom: 1rem;
        }
        .content-html-preview blockquote {
          border-left: 4px solid var(--bs-primary);
          padding-left: 1rem;
          margin: 1rem 0;
          font-style: italic;
          color: #aaa;
        }
        .content-html-preview table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 1rem;
        }
        .content-html-preview th,
        .content-html-preview td {
          border: 1px solid var(--bs-border-color);
          padding: 0.5rem;
        }
        .content-html-preview th {
          background: rgba(255, 255, 255, 0.1);
        }
      `}</style>
        </ContentWrapper>
    );
};
