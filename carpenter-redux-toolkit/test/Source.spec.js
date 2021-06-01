import Source from '../src/classes/Source';

describe('carpenter-redux-toolkit', () => {
  describe('Source', () => {
    describe('(constructor)', () => {
      it('should have the right name', () => {
        const s = new Source('bob');

        expect(s.name).toBe('bob');
        expect(s.key).toBe(('bob'));
        expect(s.members).toBeInstanceOf(Map);
      });

      it('should use provided members', () =>{
        const s = new Source('bob', new Map([[100, { foo: 'bar' }]]));

        expect(s.name).toBe('bob');
        expect(s.key).toBe(('bob'));
        expect(s.members.get(100).foo).toBe('bar');
      });
    });

    describe('set', () => {
      const s = new Source('kittens');

      s.set('mittens', {name: 'Mittens the Kitten', age: 0.5});
      expect(s.get('mittens').age).toBe(0.5);
    });

    describe('del', () => {
      let s = new Source('kittens');
      s.set('mittens', 'a kitten named mittens');
      s.set('twinkles', 'a kitten named twinkles');
      s.set('furry', 'a kitten named furry');

      expect(s.size).toBe(3);
      s.del('twinkles');
      expect(s.size).toBe(2);
      s.del('twinkles'); // can delete missing value without error
      expect(s.size).toBe(2);
    });

    describe('my', () => {
      let s = new Source('kittens');
      s.set('mittens', 'a kitten named mittens');

      expect(s.my.mittens).toBe('a kitten named mittens');
    });
  });
});
