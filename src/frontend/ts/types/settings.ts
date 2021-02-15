export class Settings {
    General: SettingsGeneral
    Privacy: SettingsPrivacy
}

class SettingsGeneral {
    ShowRealm: boolean
}

class SettingsPrivacy {
    Anonymized: boolean
    Public: boolean
    ShowInLeaderboards: boolean
}
