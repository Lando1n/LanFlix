from .Media import Media, MediaType


def test_episode_gets_name():
    media = Media('show.S01E04.1080p.mp4')
    assert media.name == 'show'


def test_show_gets_name():
    media = Media('movie.1080p.mp4')
    assert media.name == 'movie.1080p.mp4'


def test_episode_type_as_file():
    media = Media('show.S01E04.1080p.mp4')
    assert media.type == MediaType.EPISODE


def test_season_type_as_file():
    media = Media('something.S01.1080p')
    assert media.type == MediaType.SEASON


def test_movie_type_as_file():
    media = Media('The.Great.Movie.Of.2014.mp4')
    assert media.type == MediaType.MOVIE
