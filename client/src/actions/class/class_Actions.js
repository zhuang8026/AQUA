//取得課程類型與等級
export const getTypeLevelData = data => ({
  type: 'GET_TYPEDATA',
  value: data,
})
export const getTypeLevelDataAsync = () => {
  return async dispatch => {
    const request = new Request('http://127.0.0.1:5000/classtype/level', {
      method: 'GET',
      headers: new Headers({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
    })

    const response = await fetch(request)
    const data = await response.json()
    dispatch(getTypeLevelData(data))
  }
}

//取得課程列表資料
export const getClassData = data => ({
  type: 'GET_CLASSDATA',
  value: data,
})

export const getClassDataAsync = (type, level, sort, page) => {
  return async dispatch => {
    let query = []

    if (type) query.push(`type=${type.trim()}`)
    if (level) query.push(`level=${level.trim()}`)
    if (sort) query.push(`sort=${sort.trim()}`)
    if (page) query.push(`page=${page.trim()}`)
    if (query.length > 0) {
      query = query.join('&')
    } else {
      query = ''
    }

    const request = new Request(`http://127.0.0.1:5000/class?${query}`, {
      method: 'GET',
      headers: new Headers({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
    })

    const response = await fetch(request)
    const data = await response.json()
    dispatch(getClassData(data))
  }
}

//取得課程的詳細資料
export const getclassDetailData = data => ({
  type: 'GET_CLASSDETAIDATA',
  value: data,
})

export const getclassDetailDataAsync = classId => {
  return async dispatch => {
    const request = new Request(`http://127.0.0.1:5000/class/${classId}`, {
      method: 'GET',
      headers: new Headers({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
    })

    const response = await fetch(request)
    const data = await response.json()
    dispatch(getclassDetailData(data))
  }
}
