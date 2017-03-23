let makeRoute = function (root, args) {
    let slashAtStart = /^\//;
    let slashAtEnd = /\/$/;
    let parts = Array.prototype.slice.call(args, 0);
    let route = root.replace(slashAtEnd, '');

    parts.forEach((part) => {
        if (part) {
            route = [route, part.replace(slashAtStart, '').replace(slashAtEnd, '')].join('/');
        }
    });

    return route += '/';
};

export default function () {
    let path = window.location.pathname;
    let subdir = path.substr(0, path.search('/extend/'));
    let extendRoot = `${subdir}/extend/blog-navbar`;
    let assetRoot = `${subdir}/extend/assets/`;
    let apiRoot = `${subdir}/extend/api/v0.1`;

    function assetUrl(src) {
        return subdir + src;
    }

    return {
        extendRoot,
        assetRoot,
        apiRoot,
        subdir,
        blogRoot: `${subdir}/`,
        count: 'https://count.ghost.org/',

        url: {
            extend() {
                return makeRoute(extendRoot, arguments);
            },

            api() {
                return makeRoute(apiRoot, arguments);
            },

            join() {
                if (arguments.length > 1) {
                    return makeRoute(arguments[0], Array.prototype.slice.call(arguments, 1));
                } else if (arguments.length === 1) {
                    let [arg] = arguments;
                    return arg.slice(-1) === '/' ? arg : `${arg}/`;
                }
                return '/';
            },

            asset: assetUrl
        }
    };
}
