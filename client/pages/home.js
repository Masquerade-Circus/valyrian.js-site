import logo from '../../public/logo.svg';

let Page = {
    view() {
        return [
            v('article[data-background=white]', [
                v('div#home-middle', [
                    v('div', v.trust(logo))
                ])
            ])
        ];
    }
};

export default Page;
