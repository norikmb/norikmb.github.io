import type { AdventCalendarYear } from '../content/config';

export interface ReferrerPattern {
    pattern: string;
    text: string;
    day: string;
}

export interface CalendarConfig {
    referrerPatterns: ReferrerPattern[];
    defaultText: string;
    defaultDay: string;
}

export const adventCalendarConfigs: Record<AdventCalendarYear, CalendarConfig> = {
    2024: {
        referrerPatterns: [
            {
                pattern: 'https://qiita.com/',
                text: '<a href="https://qiita.com/advent-calendar/2024/fujitsu">Fujitsu Advent Calendar 2024</a>',
                day: '13',
            },
            {
                pattern: 'https://adventar.org/',
                text: '<a href="https://adventar.org/calendars/11224">refererテスト Advent Calendar 2024</a>',
                day: '1',
            },
            {
                pattern: 'https://fujitsu.sharepoint.com/',
                text: '<a href="https://fujitsu.sharepoint.com/teams/xn--jp-lt-wt2h/SitePages/Advent-Calendar-2024.aspx">LT会AdventCalendar2024</a>',
                day: '11',
            },
        ],
        defaultText: 'HogeHoge',
        defaultDay: 'N',
    },
    2025: {
        referrerPatterns: [
            {
                pattern: 'https://fujitsu.sharepoint.com/',
                text: '<a href="https://fujitsu.sharepoint.com/teams/xn--jp-lt-wt2h/SitePages/Advent-Calendar-2025.aspx">LT会AdventCalendar2025</a>',
                day: '7',
            },
            {
                pattern: 'https://loop.cloud.microsoft/',
                text: '<a href="https://fujitsu.sharepoint.com/teams/xn--jp-lt-wt2h/SitePages/Advent-Calendar-2025.aspx">LT会AdventCalendar2025</a>',
                day: '7',
            },
        ],
        defaultText:
            '<a href="https://qiita.com/advent-calendar/2025/fujitsu">FUJITSU Advent Calendar 2025</a>',
        defaultDay: '7',
    },
};

export function findCalendarByReferrer(
    config: CalendarConfig,
    referrer: string
): { text: string; day: string } {
    for (const pattern of config.referrerPatterns) {
        if (referrer.includes(pattern.pattern)) {
            return {
                text: pattern.text,
                day: pattern.day,
            };
        }
    }

    return {
        text: config.defaultText,
        day: config.defaultDay,
    };
}
