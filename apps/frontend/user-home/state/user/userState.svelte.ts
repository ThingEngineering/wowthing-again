import { DataUserGeneral } from './data/general.svelte';

class UserState {
    public general = new DataUserGeneral();
    // userAchievementData: UserAchievementData;
    // userQuestData: UserQuestData;

    public something() {
        // TODO: fetch user/achievements/quests
        // TODO: process
        // this.general.process(userData);
    }
}

export const userState = new UserState();
