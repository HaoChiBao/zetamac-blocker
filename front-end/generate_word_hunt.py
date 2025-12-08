import json
import random
import collections

def get_subwords(base_word, dictionary):
    base_counter = collections.Counter(base_word)
    subwords = []
    for word in dictionary:
        # Optimization: skip if word is longer than base or not a subset
        if len(word) > len(base_word):
            continue
        word_counter = collections.Counter(word)
        if all(word_counter[c] <= base_counter[c] for c in word_counter):
            subwords.append(word)
    return subwords

def generate_sets():
    # Load dictionary
    with open('/usr/share/dict/words', 'r') as f:
        all_words = [w.strip().lower() for w in f if w.strip().isalpha()]

    # Filter for potential base words (6-7 letters are good for this game)
    # We want common enough words, but the system dict has a lot of obscure ones.
    # We'll just pick random ones and hope they aren't too weird, or maybe filter by length.
    base_candidates = [w for w in all_words if 6 <= len(w) <= 7]
    
    # Shuffle to get random sets
    random.shuffle(base_candidates)

    sets = []
    seen_bases = set()
    
    # Pre-process dictionary for faster lookup? 
    # Actually, iterating 200k words for every base word 100 times is slow (20 million ops).
    # Let's optimize: Group dictionary by word length.
    words_by_len = collections.defaultdict(list)
    for w in all_words:
        if 3 <= len(w) <= 7: # Minimum 3 letters for the game usually
            words_by_len[len(w)].append(w)

    count = 0
    for base_word in base_candidates:
        if count >= 100:
            break
        if base_word in seen_bases:
            continue

        # Find all valid subwords
        valid_words = []
        base_counter = collections.Counter(base_word)
        
        # Check against words of length 3 up to len(base_word)
        for length in range(3, len(base_word) + 1):
            for w in words_by_len[length]:
                w_counter = collections.Counter(w)
                if all(w_counter[c] <= base_counter[c] for c in w_counter):
                    valid_words.append(w)
        
        # Only accept if we have a decent number of words (e.g., at least 5)
        if len(valid_words) < 10:
            continue

        # Sort words by length for the output structure
        words_grouped = collections.defaultdict(list)
        for w in valid_words:
            words_grouped[len(w)].append(w)

        # Format for JSON
        game_set = {
            "letters": list(base_word.upper()),
            "source_word": base_word,
            "words": {k: sorted(v) for k, v in words_grouped.items()}
        }
        
        sets.append(game_set)
        seen_bases.add(base_word)
        count += 1
        print(f"Generated set {count}: {base_word}")

    with open('word_hunt_data.json', 'w') as f:
        json.dump(sets, f, indent=2)

if __name__ == "__main__":
    generate_sets()
