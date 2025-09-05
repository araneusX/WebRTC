export const parseInput = <T extends object>(input: string): { data: T | null; isError: boolean } => {
    try {
        const parsed = JSON.parse(input);
        return {
            data: parsed,
            isError: false,
        };
    } catch (error) {
        return {
            data: null,
            isError: true,
        };
    }
};
