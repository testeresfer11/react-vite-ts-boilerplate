declare module '@ckeditor/ckeditor5-react' {
    import * as React from 'react';
    import { EditorConfig } from '@ckeditor/ckeditor5-core';

    interface CKEditorProps {
        editor: any;
        data?: string;
        config?: EditorConfig | Record<string, any>;
        disabled?: boolean;
        onReady?: (editor: any) => void;
        onError?: (error: Error, details: { phase: string; willEditorRestart: boolean }) => void;
        onChange?: (event: any, editor: any) => void;
        onFocus?: (event: any, editor: any) => void;
        onBlur?: (event: any, editor: any) => void;
    }

    export class CKEditor extends React.Component<CKEditorProps> { }
}

declare module '@ckeditor/ckeditor5-build-classic' {
    const ClassicEditor: any;
    export default ClassicEditor;
}
