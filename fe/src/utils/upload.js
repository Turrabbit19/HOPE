import { createBrowserClient } from "@supabase/ssr";

export async function uploadMultipleFiles(bucketName, fileUrl, folderPath) {
    const client = () =>
        createBrowserClient(
            "https://qrrhjldgdidplxjzixkd.supabase.co",
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFycmhqbGRnZGlkcGx4anppeGtkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjkxNzYyNzcsImV4cCI6MjA0NDc1MjI3N30.Dn5GaKeC6bS8htb3cllZvfargs11irimExQGownTgdo"
        );
    const supabase = client();
    const results = [];

    try {
        const response = await fetch(fileUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch file from URL: ${fileUrl}`);
        }

        const blob = await response.blob();

        const fileName = `file_${Date.now()}_${fileUrl.split("/").pop()}`;
        const file = new File([blob], fileName, {
            type: blob.type,
        });

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
            results.push({
                success: true,
                fileName: file.name,
                data,
            });
        }
    } catch (err) {
        console.error(`Unexpected error for file URL: ${url}`, err);
        results.push({
            success: false,
            fileName: url.split("/").pop() || "unknown",
            message: `Unexpected error occurred`,
        });
    }
    return results;
}
