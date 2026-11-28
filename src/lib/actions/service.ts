import type { ServiceInput } from "@/lib/api/service"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

export const createService = async (data: ServiceInput & { vendorEmail: string }) => {
    const res = await fetch(`${BASE_URL}/services`, {
        method: "POST",
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        throw new Error("Could not add service");
    }
    return res.json();
}

export const updateService = async (id: string, data: ServiceInput) => {
    const res = await fetch(`${BASE_URL}/services/${id}`, {
        method: "PATCH",
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        throw new Error("Could not update service");
    }
    return res.json();
}

export const deleteService = async (id: string) => {
    const res = await fetch(`${BASE_URL}/services/${id}`, {
        method: 'DELETE'
    });
    if (!res.ok) {
        throw new Error("Could not delete service");
    }
    return res.json();
}