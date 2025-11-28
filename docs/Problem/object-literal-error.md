Object literal may only specify known properties, and 'type' does not exist in type 'MaybeDocument | ViewDocument<unknown>'.

    await boardsDB.insert({
      _id: new Date().toISOString(),
      type: 'board',
      title: title.trim(),
    });

# to

     await boardsDB.insert({
      _id: new Date().toISOString(),
      type: 'board',
      title: title.trim(),
    } as Board);
