class Memo {
  constructor(id, title, content, importance, pinned = false, createdAt = new Date()) {
      this.id = id;
      this.title = title;
      this.content = content;
      this.importance = importance;
      this.pinned = pinned;
      this.createdAt = createdAt;
  }
}

class MemoApp {
  constructor() {
      this.memos = [];
      this.loadMemos();
      this.setupEventListeners();
  }

  loadMemos() {
      const savedMemos = localStorage.getItem('memos');
      if (savedMemos) {
          this.memos = JSON.parse(savedMemos).map(memo => {
              return new Memo(
                  memo.id,
                  memo.title,
                  memo.content,
                  memo.importance,
                  memo.pinned,
                  new Date(memo.createdAt)
              );
          });
      }
      this.displayMemos();
  }

  saveMemos() {
      localStorage.setItem('memos', JSON.stringify(this.memos));
  }

  setupEventListeners() {
      document.getElementById('saveBtn').addEventListener('click', () => this.saveMemo());
      document.getElementById('searchInput').addEventListener('input', (e) => this.searchMemos(e.target.value));
  }

  saveMemo() {
      const titleInput = document.getElementById('memoTitle');
      const contentInput = document.getElementById('memoContent');
      const importanceSelect = document.getElementById('importance');

      const title = titleInput.value.trim();
      const content = contentInput.value.trim();
      const importance = importanceSelect.value;

      if (!title || !content) {
          alert('タイトルと内容を入力してください。');
          return;
      }

      const memo = new Memo(
          Date.now(),
          title,
          content,
          importance
      );

      this.memos.push(memo);
      this.saveMemos();
      this.displayMemos();

      // フォームをリセット
      titleInput.value = '';
      contentInput.value = '';
      importanceSelect.value = 'low';
  }

  deleteMemo(id) {
      this.memos = this.memos.filter(memo => memo.id !== id);
      this.saveMemos();
      this.displayMemos();
  }

  togglePin(id) {
      const memo = this.memos.find(memo => memo.id === id);
      if (memo) {
          memo.pinned = !memo.pinned;
          this.saveMemos();
          this.displayMemos();
      }
  }

  editMemo(id) {
      const memo = this.memos.find(memo => memo.id === id);
      if (!memo) return;

      const newTitle = prompt('新しいタイトルを入力してください:', memo.title);
      const newContent = prompt('新しい内容を入力してください:', memo.content);

      if (newTitle !== null && newContent !== null) {
          memo.title = newTitle.trim();
          memo.content = newContent.trim();
          this.saveMemos();
          this.displayMemos();
      }
  }

  searchMemos(query) {
      if (!query) {
          this.displayMemos();
          return;
      }

      const filteredMemos = this.memos.filter(memo => 
          memo.title.toLowerCase().includes(query.toLowerCase()) ||
          memo.content.toLowerCase().includes(query.toLowerCase())
      );

      this.displayFilteredMemos(filteredMemos);
  }

  displayFilteredMemos(filteredMemos) {
      const pinnedContainer = document.querySelector('#pinnedMemos .memo-container');
      const normalContainer = document.querySelector('#normalMemos .memo-container');

      pinnedContainer.innerHTML = '';
      normalContainer.innerHTML = '';

      filteredMemos.forEach(memo => {
          const memoElement = this.createMemoElement(memo);
          if (memo.pinned) {
              pinnedContainer.appendChild(memoElement);
          } else {
              normalContainer.appendChild(memoElement);
          }
      });
  }

  displayMemos() {
      const pinnedContainer = document.querySelector('#pinnedMemos .memo-container');
      const normalContainer = document.querySelector('#normalMemos .memo-container');

      pinnedContainer.innerHTML = '';
      normalContainer.innerHTML = '';

      this.memos.forEach(memo => {
          const memoElement = this.createMemoElement(memo);
          if (memo.pinned) {
              pinnedContainer.appendChild(memoElement);
          } else {
              normalContainer.appendChild(memoElement);
          }
      });
  }

  createMemoElement(memo) {
      const div = document.createElement('div');
      div.className = `memo importance-${memo.importance}`;
      if (memo.pinned) div.classList.add('pinned');

      div.innerHTML = `
          <h3>${memo.title}</h3>
          <p>${memo.content}</p>
          <div class="memo-date">作成日: ${new Date(memo.createdAt).toLocaleString()}</div>
          <div class="memo-actions">
              <button class="pin-btn">${memo.pinned ? '🔓 ピン解除' : '📌 ピン留め'}</button>
              <button class="edit-btn">✏️ 編集</button>
              <button class="delete-btn">🗑️ 削除</button>
          </div>
      `;

      div.querySelector('.pin-btn').addEventListener('click', () => this.togglePin(memo.id));
      div.querySelector('.edit-btn').addEventListener('click', () => this.editMemo(memo.id));
      div.querySelector('.delete-btn').addEventListener('click', () => this.deleteMemo(memo.id));

      return div;
  }
}

// アプリケーションの初期化
document.addEventListener('DOMContentLoaded', function() {
  new MemoApp();
});