

export interface ReplyUtils {
    json: (data: any) => void,
    json_code: (code: number, data: any) => void
}

type ReplyHandler = (rep_util: ReplyUtils, req: any, rep: any) => Promise<void>


const reply_utils_hook = (handler: ReplyHandler) => async (request: any, reply: any) => {
    const utils: ReplyUtils =  {
         json : (data: any) => {
            reply
                .code(200)
                .header('Content-Type', 'application/json; charset=utf-8')
                .send(data)
        },
        
        json_code : (code: number, data: any) => {
            reply
                .code(code)
                .header('Content-Type', 'application/json; charset=utf-8')
                .send(data)
        }
    }
    //try {
    await handler(utils, request, reply)
    // } catch(e) {
    //     console.log(e)
    // }
}

export default reply_utils_hook