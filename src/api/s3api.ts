import axiosAuth from "@/plugins/axiosAuth";

// s3 업로드 api 
export async function s3upload(obj: FormData) {
    const response = await axiosAuth.post(`/api/s3upload`, obj, {
      headers: { "Content-Type" : "multipart/form-data" },
    })
    return response.data;
  }