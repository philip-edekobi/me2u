import { ResolverContext } from "#root/graphql/types"

interface Args {
    me: boolean;
}

export default function userSessionResolver(obj: any, args: Args, context: ResolverContext){
    if (args.me !== true) throw new Error("Unsupported argument value");

    return context.res.locals.userSession;
}