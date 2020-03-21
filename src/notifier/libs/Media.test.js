const Media = require('./Media');

describe('Typing', () => {
  test('Properly type movie', () => {
    const name = 'Die.Hard.2012.1080p';
    const media = new Media(name)
    expect(media.type).toEqual('movie');
  });
  
  test('Properly type show', () => {
    const name = 'Atlanta.S01E04.1080p';
    const media = new Media(name)
    expect(media.type).toEqual('show');
  });
  
  test('Properly type season', () => {
    const name = 'Desperate.House.Wifes.S08.720p';
    const media = new Media(name)
    expect(media.type).toEqual('season');
  });  
});

describe('Naming', () => {
  test('Properly name movie', () => {
    const name = 'Die.Hard.2012.1080p';
    const media = new Media(name)
    expect(media.name).toEqual('Die.Hard.2012.1080p');
  });
  
  test('Properly name show', () => {
    const name = 'The.Handmaids.Tale.S01E04.1080p';
    const media = new Media(name)
    expect(media.name).toEqual('The Handmaids Tale');
  });
  
  test('Properly name season', () => {
    const name = 'Desperate.House.Wives.S08.720p';
    const media = new Media(name)
    expect(media.name).toEqual('Desperate House Wives');
  });
});
