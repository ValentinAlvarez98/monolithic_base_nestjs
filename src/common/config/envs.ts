
import 'dotenv/config'
import * as joi from 'joi'
import { CustomError } from '../utils'

interface EnvVars {

      PORT: number

      DATABASE_URL: string

      JWT_SECRET: string

}

const envsSchema = joi.object({

      PORT: joi.number().required(),

      DATABASE_URL: joi.string().required(),

      JWT_SECRET: joi.string().required(),

}).unknown(true)

const { error, value } = envsSchema.validate({
      ...process.env,
})

if (error) {

      throw new CustomError(500, `Config validation error: ${error.message}`)

}

const envVars: EnvVars = value;

export const envs = {

      port: envVars.PORT,

      databaseUrl: envVars.DATABASE_URL,

      jwtSecret: envVars.JWT_SECRET,

}