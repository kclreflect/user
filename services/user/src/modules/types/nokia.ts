import { IntegerKind, Static, Type } from '@sinclair/typebox'

export const Callback = Type.Object({code:Type.String(), state:Type.String()});
export type CallbackType = Static<typeof Callback>;

export const NokiaId = Type.Object({nokiaId:Type.String()});
export type NokiaIdType = Static<typeof NokiaId>;
export const PatientId = Type.Object({patientId:Type.String()});
export type PatientIdType = Static<typeof PatientId>;

export interface TokenResponseBody { access_token:string, expires_in:number, token_type:string, scope:string, refresh_token:string, userid:string };
