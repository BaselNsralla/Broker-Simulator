
export class Url {
    base_url: string
    params: [string, string][]
    path_url: string 

    constructor(base_url: string) {
        this.base_url = base_url
        this.path_url = ''
        this.params = []
    }

    addParam(key: string, value: string) {
        this.params.push([key, value])
    }

    addSub(...path: string[]) {
        this.path_url += `/${path.join('/')}`
    }

    buildParams() {
        let params: string = `?${this.params[0][0]}=${this.params[0][1]}`
        this.params.slice(1).forEach((element: [string, string]) => {
            params += `&${element[0]}=${element[1]}`
        })
        return params
    }

    toString(): string {
        const size: Number = this.params.length
        if (size == 0) { return this.base_url }
        const params_url = this.buildParams()
        const url = this.base_url + this.path_url + params_url
        return url 
    }
}
