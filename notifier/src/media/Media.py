import re


class MediaType:
    MOVIE = 'MOVIE'
    EPISODE = "EPISODE"
    SEASON = "SEASON"


class Media:
    def __init__(self, filename):
        self.type = self.__get_type(filename)
        self.name = self.__get_name(filename)

    def __get_name(self, filename):
        season_pattern = re.compile("S[0-9][0-9]")
        episode_pattern = re.compile("S[0-9][0-9]E[0-9][0-9]")
        name = ""
        if self.type == MediaType.MOVIE:
            name = filename
        else:
            name_array = filename.replace(
                '-', '.').replace(' ', '.').split('.')
            for value in name_array:
                if episode_pattern.match(value.upper()) or \
                   season_pattern.match(value.upper()):
                    break
                else:
                    name += " {0}".format(value)
        return name.strip()

    def __get_type(self, filename):
        media_type = MediaType.MOVIE
        season_pattern = re.compile("S[0-9][0-9]")
        episode_pattern = re.compile("S[0-9][0-9]E[0-9][0-9]")
        name_array = filename.replace('-', '.') \
                             .replace(' ', '.') \
                             .split('.')
        for value in name_array:
            if episode_pattern.match(value.upper()):
                media_type = MediaType.EPISODE
                break
            elif season_pattern.match(value.upper()):
                media_type = MediaType.SEASON
                break
        return media_type
