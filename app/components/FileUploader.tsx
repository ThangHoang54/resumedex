import React, {type JSX, useState} from "react";
import {useCallback} from "react";
import {useDropzone} from "react-dropzone";
import {formatSize} from "~/lib/utils";

interface FileUploaderProps {
    onFileSelect?: (file: (File | null)) => void;
    selectedFile: File | null;
}

const FileUploader = ({ onFileSelect, selectedFile }: FileUploaderProps) => {
    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0] || null;
        onFileSelect?.(file);
    }, [onFileSelect]);

    const maxFileSize = 20 * 1024 * 1024;
    const {getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        multiple: false,
        accept: {'application/pdf': ['.pdf']},
        maxSize: maxFileSize,
    });

    const file = selectedFile;

    return (
        <div className="w-full">
            <div {...getRootProps()}
                 className={`
                    relative group cursor-pointer transition-all duration-300 ease-in-out
                    border-2 border-dashed rounded-2xl p-8
                    flex flex-col items-center justify-center text-center
                    min-h-[200px]
                    ${isDragActive
                     ? 'border-blue-500 bg-blue-50 scale-[1.01]'
                     : 'border-gray-300 bg-white hover:border-blue-400 hover:bg-gray-50'
                 }
                    ${file ? 'border-green-300 bg-green-50/30' : ''}
                `}
            >
                <input {...getInputProps({ id: 'uploader' })} />

                <div className="space-y-4 cursor-pointer w-full flex flex-col items-center">

                    {file ? (
                        <div className="w-full animate-in zoom-in-95 duration-300" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-between p-4 bg-white shadow-md rounded-xl border border-gray-100">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center shrink-0">
                                        <img src="/images/pdf.png" alt="pdf" className="w-8 h-8 object-contain" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-gray-900 font-semibold truncate max-w-[180px] sm:max-w-xs">
                                            {file.name}
                                        </p>
                                        <p className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-0.5 rounded-full w-fit mt-1">
                                            {formatSize(file.size)}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    className="p-2 hover:bg-red-50 rounded-full transition-colors group/btn"
                                    onClick={(e) => {
                                        e.stopPropagation(); // Prevent dropzone click
                                        onFileSelect?.(null);
                                    }}
                                >
                                    <img src="/icons/cross.svg" alt="Remove" className="w-5 h-5 opacity-40 group-hover/btn:opacity-100 transition-opacity" />
                                </button>
                            </div>
                            <p className="text-xs text-center text-green-600 font-medium mt-3">
                                File ready for analysis
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4 pointer-events-none">
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto transition-colors ${isDragActive ? 'bg-blue-100' : 'bg-gray-100 group-hover:bg-blue-50'}`}>
                                <img src="/icons/info.svg" alt="Upload" className={`w-8 h-8 ${isDragActive ? 'opacity-100' : 'opacity-40 group-hover:opacity-70'}`}/>
                            </div>
                            <div>
                                <p className="text-lg font-semibold text-gray-700">
                                    {isDragActive ? "Drop it like it's hot!" : "Click to upload or drag & drop"}
                                </p>
                                <p className="text-sm text-gray-400 mt-1">
                                    PDF (Max {formatSize(maxFileSize)})
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
export default FileUploader