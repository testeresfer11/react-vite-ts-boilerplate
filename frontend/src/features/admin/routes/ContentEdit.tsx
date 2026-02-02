import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import { Controller } from "react-hook-form";
import ContentWrapper from "@/components/Layout/AdminLayout/ContentWrapper";
import { Button } from "@/components/Elements";
import { Spinner } from "@/components/Elements/Spinner";
import { Form, InputField, TextAreaField } from "@/components/Form";
import { useContent } from "../hooks/useContent";
import { useUpdateContent } from "../hooks/useUpdateContent";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const schema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().min(1, "Description is required"),
    content: z.string().min(1, "Content is required"),
});

type ContentEditValues = z.infer<typeof schema>;

export const ContentEdit = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    // React Query hooks
    const { data: contentResponse, isLoading: fetchLoading } = useContent(id || "");
    const updateContentMutation = useUpdateContent();

    if (fetchLoading) {
        return (
            <ContentWrapper title="Edit Content">
                <div
                    className="d-flex justify-content-center align-items-center"
                    style={{ minHeight: "400px" }}
                >
                    <Spinner size="lg" />
                </div>
            </ContentWrapper>
        );
    }

    if (!contentResponse?.data) return null;

    return (
        <ContentWrapper title="Edit Content">
            <div className="content-edit">
                {/* Header Section */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div className="d-flex align-items-center gap-3">
                        <button
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => navigate("/admin/content")}
                        >
                            <i className="fa-solid fa-arrow-left"></i>
                        </button>
                        <h2 className="text-white f-24 semi-bold mb-0">Edit Content</h2>
                    </div>
                </div>

                {/* Form Card */}
                <div className="cardbg rounded-lg p-4">
                    <Form<ContentEditValues, typeof schema>
                        onSubmit={async (values) => {
                            if (!id) return;
                            await updateContentMutation.mutateAsync({ id, data: values });
                            navigate("/admin/content");
                        }}
                        schema={schema}
                        options={{
                            defaultValues: {
                                name: contentResponse.data.name,
                                description: contentResponse.data.description,
                                content: contentResponse.data.content,
                            },
                        }}
                    >
                        {({ register, formState: { errors }, control }) => (
                            <>
                                {/* Name Field */}
                                <div className="mb-4">
                                    <label className="form-label text-white">
                                        Name <span className="text-danger">*</span>
                                    </label>
                                    <InputField
                                        registration={register("name")}
                                        error={errors.name}
                                        placeholder="Enter content name"
                                    />
                                </div>

                                {/* Description Field */}
                                <div className="mb-4">
                                    <label className="form-label text-white">
                                        Description <span className="text-danger">*</span>
                                    </label>
                                    <TextAreaField
                                        registration={register("description")}
                                        error={errors.description}
                                        placeholder="Enter content description"
                                        rows={3}
                                    />
                                </div>

                                {/* Content Field with CKEditor */}
                                <div className="mb-4">
                                    <label className="form-label text-white">
                                        Content <span className="text-danger">*</span>
                                    </label>
                                    <Controller
                                        name="content"
                                        control={control}
                                        render={({ field: { onChange, value } }) => (
                                            <div
                                                className={`ckeditor-wrapper ${errors.content ? "is-invalid-editor" : ""}`}
                                            >
                                                <CKEditor
                                                    editor={ClassicEditor}
                                                    data={value || ""}
                                                    onChange={(_event: any, editor: any) => {
                                                        const data = editor.getData();
                                                        onChange(data);
                                                    }}
                                                    config={{
                                                        placeholder: "Enter your content here...",
                                                        toolbar: [
                                                            "heading",
                                                            "|",
                                                            "bold",
                                                            "italic",
                                                            "link",
                                                            "bulletedList",
                                                            "numberedList",
                                                            "|",
                                                            "blockQuote",
                                                            "insertTable",
                                                            "|",
                                                            "undo",
                                                            "redo",
                                                        ],
                                                    }}
                                                />
                                            </div>
                                        )}
                                    />
                                    {errors.content && (
                                        <div className="text-danger small mt-1">{errors.content?.message}</div>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div className="d-flex gap-3 justify-content-end mt-4">
                                    <Button
                                        variant="outline"
                                        type="button"
                                        onClick={() => navigate("/admin/content")}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="primary"
                                        type="submit"
                                        isLoading={updateContentMutation.isLoading}
                                    >
                                        Update Content
                                    </Button>
                                </div>
                            </>
                        )}
                    </Form>
                </div>
            </div>

            {/* CKEditor Custom Styles */}
            <style>{`
        .ck-editor__editable {
          min-height: 300px;
          background: var(--bs-body-bg) !important;
          color: #fff !important;
        }
        .ck.ck-editor__main>.ck-editor__editable:not(.ck-focused) {
          border-color: var(--bs-border-color) !important;
        }
        .ck.ck-toolbar {
          background: var(--bs-secondary-bg) !important;
          border-color: var(--bs-border-color) !important;
        }
        .ck.ck-button:not(.ck-disabled):hover {
          background: var(--bs-tertiary-bg) !important;
        }
        .is-invalid-editor .ck-editor__editable {
          border-color: var(--bs-danger) !important;
        }
      `}</style>
        </ContentWrapper>
    );
};
