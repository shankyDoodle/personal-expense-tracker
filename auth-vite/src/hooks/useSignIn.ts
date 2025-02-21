import type { Session } from "@toolpad/core/AppProvider";

export const useSignIn = () => {
  const fakeAsyncGetSession = async (formData: any): Promise<Session> => {
    console.log("heheheh");
    return new Promise((resolve, reject) => {
      console.log("heheheh");
      if (formData.get("password") === "password") {
        resolve({
          user: {
            name: "Fake User",
            email: formData.get("email") || "",
            image: "https://i.pravatar.cc/300",
          },
        });
      }
      reject(new Error("Incorrect credentials."));
    });
  };

  return {
    fakeAsyncGetSession,
  };
};
