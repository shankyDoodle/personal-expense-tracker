import type { Session } from "@toolpad/core/AppProvider";

export const useSignIn = () => {
  const fakeAsyncGetSession = async (formData: any): Promise<Session> => {
    return new Promise((resolve, reject) => {
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
