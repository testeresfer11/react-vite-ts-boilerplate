import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { Controller } from "react-hook-form";
import ContentWrapper from "@/components/Layout/AdminLayout/ContentWrapper";
import { Button } from "@/components/Elements";
import { Form, InputField, TextAreaField } from "@/components/Form";
import { useCreateContent } from "../hooks/useCreateContent";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const schema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().min(1, "Description is required"),
    content: z.string().min(1, "Content is required"),
});

type ContentAddValues = z.infer<typeof schema>;

export const ContentAdd = () => {
    const navigate = useNavigate();
    const createContentMutation = useCreateContent();

    return (
        <ContentWrapper title="Add Content">
            <div className="content-add">
                {/* Header Section */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div className="d-flex align-items-center gap-3">
                        <button
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => navigate("/admin/content")}
                        >
                            <i className="fa-solid fa-arrow-left"></i>
                        </button>
                        <h2 className="text-white f-24 semi-bold mb-0">Add New Content</h2>
                    </div>
                </div>

                {/* Form Card */}
                <div className="cardbg rounded-lg p-4">
                    <Form<ContentAddValues, typeof schema>
                        onSubmit={async (values) => {
                            await createContentMutation.mutateAsync(values);
                            navigate("/admin/content");
                        }}
                        schema={schema}
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
                                        isLoading={createContentMutation.isLoading}
                                    >
                                        Create Content
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
