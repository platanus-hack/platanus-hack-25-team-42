import { createFileRoute } from "@tanstack/react-router";
import { getUserData, createUserData, getUserDataByTypeList } from "@/db/crud/user_data";

export const Route = createFileRoute("/api/user-data/$userId")({
    server: {
        handlers: {
            GET: async ({ request, params }: { request: Request; params: { userId: string } }) => {
                try {
                    const url = new URL(request.url);
                    const typesParam = url.searchParams.get("types");

                    let data;
                    if (typesParam) {
                        const types = typesParam.split(",");
                        data = await getUserDataByTypeList(params.userId, types);
                    } else {
                        data = await getUserData(params.userId);
                    }

                    return new Response(JSON.stringify(data), {
                        status: 200,
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });
                } catch (error) {
                    console.error("Error fetching user data:", error);
                    return new Response(
                        JSON.stringify({ error: "Failed to fetch user data" }),
                        {
                            status: 500,
                            headers: {
                                "Content-Type": "application/json",
                            },
                        }
                    );
                }
            },
            POST: async ({ request, params }: { request: Request; params: { userId: string } }) => {
                try {
                    const body = await request.json();
                    // Ensure userId from params is used
                    const newData = { ...body, userId: params.userId };

                    const result = await createUserData(newData);

                    return new Response(JSON.stringify(result), {
                        status: 201,
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });
                } catch (error) {
                    console.error("Error creating user data:", error);
                    return new Response(
                        JSON.stringify({ error: "Failed to create user data" }),
                        {
                            status: 500,
                            headers: {
                                "Content-Type": "application/json",
                            },
                        }
                    );
                }
            },
        },
    },
});
