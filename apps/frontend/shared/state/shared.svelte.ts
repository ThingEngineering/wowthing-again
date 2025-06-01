class SharedState {
    public public: boolean = $state(false);
    public xsrf: string = document.getElementById('app').getAttribute('data-xsrf');
}

export const sharedState = new SharedState();
