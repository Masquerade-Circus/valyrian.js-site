let Page = {
    view() {
        return [
            v('article[data-background=white]', [
                v('div#homemiddle', [
                    v('img[src=/logo.png]')
                ])
            ])
        ];
    }
};

export default Page;
