import dotenv from 'dotenv';

dotenv.config();

const EXIT_CODE = 1;

export function getEnv(variable: string, defaultValue?: string): string {
    const value = process.env[variable];
    if (!value){
        if (!defaultValue) {
            console.error(`Environment variable ${variable} is not set and no default value was provided.`);
            process.exit(EXIT_CODE);
        }
        return defaultValue;
    } 
    return value;
}