export interface Settings {
    General: SettingsGeneral
    Privacy: SettingsPrivacy
}

interface SettingsGeneral {
    ShowRealm: boolean
}

interface SettingsPrivacy {
    Anonymized: boolean
    Public: boolean
    ShowInLeaderboards: boolean
}
