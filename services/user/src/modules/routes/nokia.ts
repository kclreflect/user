import logger from '../../winston'
import { FastifyInstance } from 'fastify';
import { Callback, CallbackType, NokiaId, NokiaIdType, PatientId, PatientIdType } from '../../types/nokia';
import { NokiaDocument } from '../db/models/nokia';

export default async(server:FastifyInstance) => {

  server.route<{Querystring:CallbackType}>({
    url: '/callback',
    method: ['GET', 'HEAD'],
    schema: {querystring:Callback},
    handler: async(req, rep) => {
      const callback = req.query;
      try { 
        if(req.cookies&&Object.keys(req.cookies).includes('bar')&&req.unsignCookie(req.cookies['bar']).valid) {
          const { Nokia } = server.db.models;
          await Nokia.updateOne({'_id':req.unsignCookie(req.cookies['bar']).value||undefined}, {'nokiaId':callback.userid}, {upsert:true}); 
        }
      } catch(error) { 
        logger.error('error updating nokia credentials: '+error); 
      }
      rep.code(200).send();
    }
  });

  server.route<{Body:NokiaIdType, Reply:PatientIdType}>({
    url: '/id',
    method: ['POST'],
    schema: {body:NokiaId, response:{200:PatientId}},
    handler: async(req, rep) => {
      const {body:nokia} = req;
      const { Nokia } = server.db.models;
      let users:Array<NokiaDocument> = [];
      try { 
        users = await Nokia.find({'_id':{$ne:undefined}, 'nokiaId':nokia.nokiaId});
      } catch(error) { 
        logger.error('error updating withings credentials: '+error); 
      }
      rep.code(200).send(users.length?{"patientId":users[0]._id}:{"patientId":""});
    }
  });
  
  server.route({url:'/register', method:['GET'], handler:(_req, rep)=>{rep.view('register.pug')}});
  
  server.route<{Body:PatientIdType}>({url:'/setIdCookie', method:['POST'], schema:{body:PatientId}, handler:(req, rep)=>{rep.setCookie('bar', req.body.patientId, {path:'/', httpOnly:true, signed: true}).send()}});

};