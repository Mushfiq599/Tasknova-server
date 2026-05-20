const required = ['MONGODB_URI', 'JWT_SECRET', 'CLIENT_URL']

const validateEnv = () => {
    const missing = required.filter(key => !process.env[key])
    if (missing.length > 0) {
        console.error(`❌ Missing environment variables: ${missing.join(', ')}`)
        process.exit(1)
    }
    console.log('✅ Environment variables validated')
}

export default validateEnv