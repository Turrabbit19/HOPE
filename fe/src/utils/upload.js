import { createClient } from "@supabase/supabase-js";

export async function uploadMultipleFiles(bucketName, fileUrl, folderPath) {
    const supabase = createClient(
        "https://qrrhjldgdidplxjzixkd.supabase.co",
        "your-supabase-anon-or-service-key"
    );

    const results = [];
    try {
        const response = await fetch(fileUrl);
        if (!response.ok)
            throw new Error(`Failed to fetch file from URL: ${fileUrl}`);

        const blob = await response.blob();
        const fileName = `file_${Date.now()}_${fileUrl.split("/").pop()}`;
        const file = new File([blob], fileName, { type: blob.type });
        const filePath = `${folderPath}/${file.name}`;

        const { data, error } = await supabase.storage
            .from(bucketName)
            .upload(filePath, file);

        if (error) {
            console.error(
                `Upload failed for file ${file.name}:`,
                error.message
            );
            results.push({
                success: false,
                fileName: file.name,
                message: error.message,
            });
        } else {
            console.log(`Upload successful for file ${file.name}:`, data);
            results.push({ success: true, fileName: file.name, data });
        }
    } catch (err) {
        console.error(`Unexpected error for file URL: ${fileUrl}`, err);
        results.push({
            success: false,
            fileName: fileUrl.split("/").pop() || "unknown",
            message: `Unexpected error occurred`,
        });
    }
    return results;
}
