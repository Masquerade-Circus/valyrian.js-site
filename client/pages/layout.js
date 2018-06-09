let Page = {
    view() {
        return [
            v('header', [
                v('h1', [
                    'Valyrian.js',
                    v('small', ' v1.1.1')
                ])
            ]),
            Page.attributes.children
        ];
    }
};

export default Page;
