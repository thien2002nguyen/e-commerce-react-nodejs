import React, { memo } from 'react';
import { Editor } from '@tinymce/tinymce-react';

const MarkdownEditor = ({ label, value, changeValue, name, invalidFields, setInvalidFields }) => {
    return (
        <div className='w-full'>
            <div className='flex flex-col gap-4 w-full'>
                <span>{label}</span>
                <Editor
                    apiKey={process.env.REACT_APP_MCETINY}
                    initialValue={value}
                    init={{
                        height: 500,
                        menubar: true,
                        plugins: [
                            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
                            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                            'insertdatetime', 'media', 'table', 'preview', 'help', 'wordcount'
                        ],
                        toolbar: 'undo redo | blocks | ' +
                            'bold italic forecolor | alignleft aligncenter ' +
                            'alignright alignjustify | bullist numlist outdent indent | ' +
                            'removeformat | help',
                        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                    }}
                    onChange={e => changeValue(prev => ({ ...prev, [name]: e.target.getContent() }))}
                    onFocus={() => setInvalidFields && setInvalidFields([])}
                />

            </div>
            <div className='mt-2 h-4'>
                {invalidFields?.some(elment => elment.name === name) && <small className='text-xs text-main'>
                    {invalidFields?.find(element => element.name === name)?.mes}
                </small>}
            </div>
        </div>
    );
}

export default memo(MarkdownEditor)
