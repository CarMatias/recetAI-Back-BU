import { supabase } from "../Supabase/client"

class Notice{

    async newNotice(notice:string,hour:string,days:string[],id_user:string){
            const day = days.join("-")
            const { data, error } = await supabase.from('notice').insert([
                { 'notice': notice, 'hour': hour,'day':day,'id_user':id_user },
            ])
            return data
    }

    async getMyNotice(id_user:string){
        let { data: notice, error } = await supabase.from('notice').select("*").eq('id_user', id_user)
        return notice
    }
}
export default new Notice()